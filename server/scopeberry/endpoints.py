from flask import jsonify, request
from scopeberry.app import app
from scopeberry.openai_local import completion

@app.route('/home', methods=['GET'])
def home_endpoint():
    return jsonify({"status": "ok"})


@app.route('/completion', methods=['GET'])
def completion_endpoint():
    text = request.args.get('text')

    result = completion(text)

    return jsonify({"result": result})

