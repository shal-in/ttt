from flask import Flask, render_template, jsonify, request

# Create a Flask app
app = Flask(__name__, static_folder='static')

# Define a route
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    name = data.get('name')
    age = data.get('age')
    email = data.get('email')

    # Process the received data as needed
    # In this example, we simply return a response with a success message
    response_data = {'message': 'Data received successfully'}
    return jsonify(response_data)



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True,port=8000)