# -*-coding:utf-8 -*-
import os
import random
import datetime
import json
from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug import secure_filename
from flask import make_response
from flask import render_template
from flask.views import MethodView
from . import app
from .database import db_session
from .models import Video
from .aws import Storage
import hashlib

#views = Blueprint('views', __name__, static_folder='../static',template_folder='../templates')

if app.config['S3']:
    s3 = Storage()
    try:
        bucket = s3.get_bucket(app.config['S3_BUCKET_NAME'])
    except:
        bucket = s3.create_bucket(app.config['S3_BUCKET_NAME'])

    

@app.teardown_request
def shutdown_session(exception=None):
    db_session.remove()

from flask.views import View

class ListView(View):

    def get_template_name(self):
        raise NotImplementedError()

    def render_template(self, context):
        return render_template(self.get_template_name(), **context)

    def dispatch_request(self):
        context = {'objects': self.get_objects()}
        return self.render_template(context)

class VideoView(ListView):

    def get_template_name(self):
        return 'index.html'

    def get_objects(self):
        return Video.query.order_by(Video.rates.desc()).all()


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower()  in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        timestamp = datetime.datetime.now().strftime('%Y%m%d-%H-%M-%S')
        file = request.files['file']
        name = request.form['name']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename).strip()
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            final_filename = filename.rsplit('.', 1)[0].lower()
            v=Video(name=name, filename=final_filename)
            if filename.rsplit('.', 1)[1].lower() != u'mp4':
                os.system('ffmpeg -i /home/fu/tmp/uploads/%s -f mp4 -vcodec copy -acodec copy /home/fu/cloud/assigment2/static/uploads/%s.mp4'%(file.filename, final_filename))
            os.system('ffmpeg -i /home/fu/tmp/uploads/%s -ss 00:00:01 -f image2 -vframes 1 /home/fu/cloud/assigment2/static/uploads/%s.png'%(file.filename, final_filename))
            if app.config['S3']:
                s3.save_file(bucket, filename, file)

            db_session.add(v)
            db_session.commit()
            return redirect(url_for('videos',video_id=v.id))
        
    return render_template('upload.html')

@app.route('/videos/<int:video_id>',methods=['GET'])
def videos(video_id):
    if video_id is None:
        return url_for('index')
    video = Video.query.get(video_id)
    if not video:
        return url_for('index')
    video.url ='https://s3.amazonaws.com/shancong-fu-youtube/'+ video.filename
    return render_template('video.html', video=video)



app.add_url_rule('/',view_func=VideoView.as_view('index'),methods=['GET',])

@app.route('/like/',methods=['POST'])
def like():
    if request.method == 'POST':
        print request.form
        try:
            v=Video.query.get(request.form['video_id'])
        except:
            return 'Wrong'
        v.rates += 1
        db_session.add(v)
        db_session.commit()    
        data={'ret':'success','like':v.rates}
        return json.dumps(data)
    return json.dumps({'ret':'failed'})

#ffmpeg -i movie.mov -f mp4 -vcodec copy -acodec copy output.mp4
#ffmpeg -i output.mp4 -ss 00:00:01 -f image2 -vframes 1 out.png

#video_api = VideoAPI.as_view('video_api')
#app.add_url_rule('/videos/', defaults={'user_id': None},
#                 view_func=video_api, methods=['GET',])
#app.add_url_rule('/videos/<int:video_id>', view_func=video_api,
#                 methods=['GET', 'PUT', 'DELETE'])
