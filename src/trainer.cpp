#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "training.h"

using namespace v8;

Persistent<Function> Trainer::constructor;

Trainer::Trainer() {
}

Trainer::~Trainer() {
}

void Trainer::Init(Handle<Object> exports) {
	Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
	tpl->SetClassName(String::NewSymbol("Trainer"));
	tpl->InstanceTemplate()->SetInternalFieldCount(1);

	constructor = Persistent<Function>::New(tpl->GetFunction());
	exports->Set(String::NewSymbol("Trainer"), constructor);
}

Handle<Value> Trainer::New(const Arguments& args) {
	HandleScope scope;

	if (args.IsConstructCall()) {
		Trainer* obj = new Trainer();
		obj->Wrap(args.This());

		return args.This();
		
	} else {
		const int argc = 1;
		Local<Value> argv[argc] = { args[0] };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}