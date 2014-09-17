#-*- coding: utf-8 -*-

# set encoding
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import flask as fl
from flask_frozen import Freezer
import sys

app = fl.Flask(__name__)
freezer = Freezer(app)


@app.route('/test.html')
def view_mocha_unittest():
    return fl.render_template('test.html')

@app.route('/')
def index():
    last_name_list = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
    male_name_list = [
        '준호', '도현', '동현', '성호', '영진',
        '정호', '예준', '승민', '진우', '승현',
        '성민', '준영', '현준', '민수', '준혁',
        '현우', '상현', '지훈', '지후', '성진',
        '민석', '정훈', '우진', '민준', '성훈',
        '상훈', '민재', '준서', '건우'
    ]
    female_name_list = [
        '지연', '은지', '수민', '서연', '지현',
        '수진', '지영', '유진', '지혜', '보람',
        '아름', '지민', '지우', '현정', '윤서',
        '은주', '현주', '혜진', '은경', '은정',
        '민지', '하은', '지원', '지은', '예원',
        '민서', '서영', '예은', '서현', '수빈',
        '미영', '미경', '예지', '예진', '현지',
        '선영', '미정', '은영', '서윤'
    ]
    # http://www.hakseonglee.com/mainnew/board.php?board=kkktalk&command=body&no=197
    area_list = [
        '서울',
        '부산',
        '인천',
        '경기도',
        '대한민국',
        '강원도',
        '충청북도',
        '충청남도',
        '전라북도',
        '전라남도',
        '경상도'
    ]


    return fl.render_template('index.html',
                              last_name_list=last_name_list,
                              male_name_list=male_name_list,
                              female_name_list=female_name_list,
                              area_list=area_list)


if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == 'build':
        freezer.freeze()

    else:
        app.run(debug=True, host='0.0.0.0', port=5000)
