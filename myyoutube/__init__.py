#-*- coding:utf-8 -*-
from flask import Flask
from . import config
app = Flask(__name__, static_folder='../static',
            template_folder='../templates')
app.config.from_object(config.DevelopmentConfig)

from . import views

