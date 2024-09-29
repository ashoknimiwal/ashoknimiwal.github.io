from flask import Flask, jsonify
import os
import markdown
# import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BLOG_FOLDER = 'blogs'

def get_blog_posts():
    posts = []
    for filename in os.listdir(BLOG_FOLDER):
        if filename.endswith('.md'):
            with open(os.path.join(BLOG_FOLDER, filename), 'r') as file:
                content = file.read()
                md = markdown.Markdown(extensions=['meta'])
                html = md.convert(content)
                
                post = {
                    'title': md.Meta.get('title', [''])[0],
                    'date': md.Meta.get('date', [''])[0],
                    'excerpt': md.Meta.get('excerpt', [''])[0],
                    'image': md.Meta.get('image', ['/default-image.jpg'])[0],
                    'content': html
                }
                posts.append(post)
    
    return sorted(posts, key=lambda x: x['date'], reverse=True)

@app.route('/api/blog-posts')
def api_blog_posts():
    posts = get_blog_posts()
    return jsonify(posts)

if __name__ == '__main__':
    app.run(debug=True)