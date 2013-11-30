from collections import namedtuple


Row = namedtuple('Row', 'game_no home_team away_team \
                        home_score away_score status')
STATUS_COMPLETED = 1
STATUS_WAITING = 2

GAME_NO_END = 2
HOME_TEAM_START = 4
HOME_TEAM_END = 13
AWAY_TEAM_START = 14
AWAY_TEAM_END = 23
HOME_SCORE_START = 25
AWAY_SCORE_START = 27


def read_fixture():
    with open('fixtures/beforegame.html') as f:
        return f.read()


def extract_span(html, css_class):
    idx = 0
    content = ""
    while True:
        span_start = html.find("<span class=\"%s\">" % css_class, idx)
        if span_start == -1:
            break
        span_end = html.find("</span>", span_start)
        content += html[span_start + 16: span_end]
        idx = span_end
    return content


def extract_span_w(html):
    return extract_span(html, "W")


def extract_span_c(html):
    return extract_span(html, "C")


def extract_line(line, completed):
    game_no = int(line[0:GAME_NO_END])
    home_team = line[HOME_TEAM_START:HOME_TEAM_END]
    away_team = line[AWAY_TEAM_START:AWAY_TEAM_END]
    home_score = 0
    away_score = 0
    if completed:
        home_score = line[AWAY_SCORE_START:AWAY_SCORE_START + 1]
        away_score = line[HOME_SCORE_START:HOME_SCORE_START + 1]
    status = STATUS_COMPLETED if completed else STATUS_WAITING
    return Row(game_no,
               home_team.rstrip(),
               away_team.rstrip(),
               int(home_score),
               int(away_score),
               status)


def parse_svttext(html):
    pre_start = html.find("<pre class=\"root\"")
    pre_end = html.find("</pre>", pre_start)

    pre = html[pre_start:pre_end]

    content_completed = extract_span_c(pre)
    content_waiting = extract_span_w(pre)

    # Completed
    line_length = 39
    completed_lines = [content_completed[x:x + line_length] for x in
                       range(0, len(content_completed), line_length)]

    # Waiting lines
    waiting_lines = [content_waiting[x:x + line_length] for x in
                     range(0, len(content_waiting), line_length)]
    l1 = [extract_line(l, False) for l in waiting_lines]
    l2 = [extract_line(l, True) for l in completed_lines]
    return sorted(l1 + l2, key=lambda x: x.game_no)


if __name__ == '__main__':
    html = read_fixture()

    print parse_svttext(html)
