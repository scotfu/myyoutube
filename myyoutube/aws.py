import boto
import boto.s3
import boto.rds
import time

class Storage:
    def __init__(self):
        self.conn=boto.connect_s3()
        print 'instablish connection for s3'
    def create_bucket(self, name):
        name = u'shancong-fu-'+ name
        bucket = self.conn.create_bucket(name)
        return bucket

    def save_string(self, bucket, name, value):
        k=boto.s3.key.Key(bucket)
        k.key=name
        k.set_contents_from_string(value)
    
    def get_string(self,bucket,name):
        k=boto.s3.key.Key(bucket)
        k.key=name
        return k.get_contents_as_string()

    def save_file(self, bucket, name,file):
        k=boto.s3.key.Key(bucket)
        k.key=name
        print type(k)
        k.set_contents_from_file(file)
        k.make_public()

    def get_key_url(bucker_name,key_name):
        return s3.conn.generate_url(60, 'GET', bucket=b.name, key=k.name, force_http=True)

class CloudFront:
    def __init__(self):
        self.conn = boto.connect_cloudfront()

    def create_download_distr(self, origin, comment):
        distro = self.conn.create_distribution(origin=origin, enabled=True, comment=comment)
        print 'download done'
        return distro
    def create_streaming_distr(self,origin,comment):    
        distro = self.conn.create_streaming_distribution(origin=origin, enabled=True, comment=comment)
        print 'straming done'
        return distro
    def get_download_distrs(self):
        print 'get download'
        return self.conn.get_all_distributions()

    def get_streaming_distrs(self):
        print 'get streaming'
        return self.conn.get_all_streaming_distributions()
        

class RDS:
    def __init__(self):
        self.conn = boto.rds.RDSConnection()

    def create_instance(self):
        instance = self.conn.create_dbinstance('myrds', 5, 'db.t1.micro', 'fu','fupassword',db_name='youtube')
        while instance.status != u'available':
            print 'wating ...'
            time.sleep(5)
            instance.update()
        print 'mysql done'    
        return instance    

    def create_group(self, ip=None):
        sg = self.conn.create_dbsecurity_group('web_servers', 'Web front-ends')
        sg.authorize(cidr_ip='69.121.15.191/32')

    def get_address(self):
        return self.conn.get_all_dbinstances("myrds")[0].endpoint[0]

if __name__ == '__main__':
    pass
