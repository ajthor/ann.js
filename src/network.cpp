#include <node.h>
#include "network.h"

using namespace v8;

Persistent<Function> Network::constructor;

Network::Network(int layerCount, double * config) : layerCount_(layerCount), config_(config) {
}

Network::~Network() {
	delete[] this->config_;
}

Handle<Value> GetConfiguration(Local<String> property, const AccessorInfo& info) {
	int i, length;
	double * config;
	
	Network* instance = node::ObjectWrap::Unwrap<Network>(info.Holder());
	length = instance->GetLayerCount();
	config = instance->GetConfig();
	
	Handle<Array> array = Array::New(length);

	for (i = 0; i < length; i++) {
		array->Set(Number::New(i), Number::New(config[i]));
	}

	return array;
}

void Network::Init(Handle<Object> exports) {
	Local<FunctionTemplate> t = FunctionTemplate::New(New);
	t->SetClassName(String::NewSymbol("Network"));
	t->InstanceTemplate()->SetInternalFieldCount(1);

	t->InstanceTemplate()->SetAccessor(String::New("configuration"), GetConfiguration);

	constructor = Persistent<Function>::New(t->GetFunction());

	exports->Set(String::NewSymbol("Network"), constructor);
}

Handle<Value> Network::New(const Arguments& args) {
	HandleScope scope;

	int i, layerCount;
	double * config;

	Local<Array> array;
	Network* network_instance;

	if (!args[0]->IsArray()) {
		ThrowException(Exception::TypeError(String::New("Must provide dimensions to Network constructor.")));
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

		network_instance = new Network(layerCount, config);
		network_instance->Wrap(args.This());

		return args.This();
		
	} else {
		const int argc = 1;
		Local<Value> argv[argc] = { args[0] };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}


