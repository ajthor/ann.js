#ifndef PERCEPTRON_JS
#define PERCEPTRON_JS

#include <node.h>

class Perceptron : public node::ObjectWrap {
public:

	static void Init(v8::Handle<v8::Object> exports);
	
	double * Run(double * data);
	
	explicit Perceptron(int layerCount, double * config);
	~Perceptron();

private:
	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static v8::Persistent<v8::Function> constructor;

};

#endif