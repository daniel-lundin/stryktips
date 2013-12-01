#!/usr/bin/env python
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpclient
import os.path
import json

from svttext import parse_svttext


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        with open('./index.html') as f:
            self.write(f.read())


class ResultsHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        def response_handler(response):
            rows, utdelning = parse_svttext(response.body)
            res = {'rows': [], 'utdelning': {}}
            for row in rows:
                res['rows'].append({
                    'home_team': row.home_team,
                    'away_team': row.away_team,
                    'home_score': row.home_score,
                    'away_score': row.away_score
                })
            for ratt, price in utdelning:
                res['utdelning'][ratt] = price

            self.write(json.dumps(res))
            self.finish()

        http_client = tornado.httpclient.AsyncHTTPClient()
        http_client.fetch("http://www.svt.se/svttext/webu/pages/551.html",
                          response_handler)


def main():
    app = tornado.web.Application(
        [
            (r'/', MainHandler),
            (r"/results.json", ResultsHandler),
        ],
        login_url="/auth/login",
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        debug=True
    )
    app.listen(8000)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
