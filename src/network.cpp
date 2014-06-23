#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "network.h"

using namespace v8;

Persistent<Function> Network::constructor;

Network::Network() {
}

Network::~Network() {
}

void Network::Init(Handle<Object> exports) {
	Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
	tpl->SetClassName(String::NewSymbol("Network"));
	tpl->InstanceTemplate()->SetInternalFieldCount(1);

	constructor = Persistent<Function>::New(tpl->GetFunction());
	exports->Set(String::NewSymbol("Network"), constructor);
}

Handle<Value> Network::New(const Arguments& args) {
	HandleScope scope;

	if (args.IsConstructCall()) {
		Network* obj = new Network();
		obj->Wrap(args.This());

		return args.This();
		
	} else {
		const int argc = 1;
		Local<Value> argv[argc] = { args[0] };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}