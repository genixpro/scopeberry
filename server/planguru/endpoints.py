from flask import jsonify, request
from planguru.app import app
from planguru.openai_local import completion

@app.route('/home', methods=['GET'])
def completion_endpoint():
    return jsonify({"status": "ok"})


@app.route('/completion', methods=['GET'])
def completion_endpoint():
    text = request.args.get('text')

    result = completion(text)

    return jsonify({"result": result})

