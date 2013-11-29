from collections import namedtuple

Row = namedtuple('Row', 'home_team away_team home_score away_score')

HOME_TEAM_START = 4
HOME_TEAM_END = 13
AWAY_TEAM_START = 14
AWAY_TEAM_END = 23
HOME_SCORE_START = 25
AWAY_SCORE_START = 27


def read_fixture():
    with open('fixtures/svttext.html') as f:
        return f.read()


def extract_span_c(html):
    idx = 0
    content = ""
    while True:
        span_start = html.find("<span class=\"C\">", idx)
        if span_start == -1:
            break
        span_end = html.find("</span>", span_start)
        content += html[span_start + 16: span_end]
        idx = span_end
    return content


def extract_row(line):
    home_team = line[HOME_TEAM_START:HOME_TEAM_END]
    away_team = line[AWAY_TEAM_START:AWAY_TEAM_END]
    home_score = line[HOME_SCORE_START:HOME_SCORE_START + 1]
    away_score = line[AWAY_SCORE_START:AWAY_SCORE_START + 1]
    return Row(home_team.rstrip(), away_team.rstrip(),
               int(home_score), int(away_score))


def parse_svttext(html):
    pre_start = html.find("<pre class=\"root\"")
    pre_end = html.find("</pre>", pre_start)

    pre = html[pre_start:pre_end]

    content = extract_span_c(pre)
    line_length = 39
    lines = [content[x:x + line_length] for x in
             range(0, len(content), line_length)]

    return [extract_row(l) for l in lines]


if __name__ == '__main__':
    html = read_fixture()

    print parse_svttext(html)
