#include <node.h>
#include <v8.h>

#include "network.h"
#include "trainer.h"

using namespace v8;

void Init(Handle<Object> exports) {
	Network::Init(exports);
	Trainer::Init(exports);
}

NODE_MODULE(ann, Init)