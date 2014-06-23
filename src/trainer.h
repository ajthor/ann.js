#ifndef TRAINER_H
#define TRAINER_H

#include <node.h>

class Trainer : public node::ObjectWrap {
public:
	static void Init(v8::Handle<v8::Object> exports);

private:
	explicit Trainer();
	~Trainer();

	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static v8::Persistent<v8::Function> constructor;
};

#endif