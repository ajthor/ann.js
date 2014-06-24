#ifndef NETWORK_H
#define NETWORK_H

#include <node.h>

// The base network class definition. All derived network classes 
// will inherit from this class. All of the Javascript 'glue' methods 
// are defined in the respective classes.
class Network : public node::ObjectWrap {
public:
	static void Init(v8::Handle<v8::Object> exports);

	double * GetConfig() { return this->config_; };
	int GetLayerCount() { return this->layerCount_; };

	explicit Network(int layerCount, double * config);
	~Network();

private:
	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static v8::Persistent<v8::Function> constructor;

	int layerCount_;
	double * config_;

};

// Accessors common to all derived classes.
v8::Handle<v8::Value> GetConfiguration(v8::Local<v8::String> property, const v8::AccessorInfo& info);

#endif