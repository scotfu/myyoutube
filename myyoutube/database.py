#-*-coding: utf-8 -*-
from myyoutube import app
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from myyoutube import config
from .aws import RDS

INIT_FLAG = False

if app.config['RDS']:
    mysql = RDS()
    try:
        address = mysql.get_address()
    except:
        INIT_FLAG = True
        mysql.create_instance()
        address = mysql.get_address()    
    app.config['DATABASE_URI']= 'mysql://fu:fupassword@%s/youtube'%address

engine = create_engine(app.config['DATABASE_URI'],\
                           convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import myyoutube.models
    Base.metadata.create_all(bind=engine)

if INIT_FLAG:
    init_db()
