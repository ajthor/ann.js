#ifndef NETWORK_H
#define NETWORK_H

#include <node.h>

class Network : public node::ObjectWrap {
public:
	static void Init(v8::Handle<v8::Object> exports);

private:
	explicit Network();
	~Network();

	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static v8::Persistent<v8::Function> constructor;
};

#endif