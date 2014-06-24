#include <node.h>
#include "perceptron.h"

using namespace v8;

Persistent<Function> Perceptron::constructor;

Perceptron::Perceptron(int layerCount, double * config) : Network::layerCount_(layerCount), Network::config_(config) {
}

Perceptron::~Perceptron() {
}

void Perceptron::Init(Handle<Object> exports) {
	Local<FunctionTemplate> t = FunctionTemplate::New(New);
	t->SetClassName(String::NewSymbol("Perceptron"));
	t->InstanceTemplate()->SetInternalFieldCount(1);

	t->Inherit(exports->Get(String::New("Network")));

	constructor = Persistent<Function>::New(t->GetFunction());

	exports->Set(String::NewSymbol("Perceptron"), constructor);
}

Handle<Value> Perceptron::New(const Arguments& args) {
	HandleScope scope;

	int i, layerCount;
	double * config;

	Local<Array> array;
	Perceptron* perceptron_instance;

	if (!args[0]->IsArray()) {
		ThrowException(Exception::TypeError(String::New("Must provide dimensions to Perceptron constructor.")));
		return scope.Close(Undefined());
	}

	if (args.IsConstructCall()) {
		// Now we need to convert the array argument into a C++ array
		// so that we can pass it to the class constructor.
		array = Array::Cast(*args[0]);
		layerCount = array->Length();

		config = new double[ layerCount ];

		for (i = 0; i < layerCount; i++) {
			config[i] = array->Get(i)->NumberValue();
		}

		perceptron_instance = new Perceptron(layerCount, config);
		perceptron_instance->Wrap(args.This());

		return args.This();
		
	} else {
		const int argc = 1;
		Local<Value> argv[argc] = { args[0] };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}

