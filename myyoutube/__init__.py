#-*- coding:utf-8 -*-
from flask import Flask
from . import config
app = Flask(__name__, static_folder='../static',
            template_folder='../templates')

app.config.from_object(config.DevelopmentConfig)

from . import views
#from .aws import RDS

#rds=RDS()
#rds.create_instance('mysqlforfu','fu','fupass','youtube')
#rds.create_group()
#mysql_address = rds.get_address()

if __name__ == '__main__':
    app.run(debug=True)
