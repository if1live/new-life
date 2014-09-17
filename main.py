#-*- coding: utf-8 -*-

import flask as fl
from flask_frozen import Freezer
import sys

app = fl.Flask(__name__)
freezer = Freezer(app)


@app.route('/')
def index():
    return fl.render_template('index.html')



if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == 'build':
        freezer.freeze()

    else:
        app.run(debug=True, host='0.0.0.0', port=5000)
