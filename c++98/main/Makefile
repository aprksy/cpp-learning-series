src := $(shell find -name '*.cpp' -not -name '*-fail*' | cut -d/ -f2 | cut -d. -f1)
exe := $(src:%=%.x)

clean:
	rm -rf bin

make_dir:
	mkdir -p bin

$(src): make_dir
	g++ -o bin/$@.x $@.cpp

$(exe):
	./bin/$@ $(ARGS)

all: clean $(src)