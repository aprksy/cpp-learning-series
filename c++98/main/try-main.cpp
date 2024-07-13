// this example is borrowed from reference 1
#include <stdexcept>
#include <iostream>

struct Q {
    ~Q() noexcept(false) {
        throw std::runtime_error("will escape");
    }
} q;

int main() try {
    throw std::runtime_error("will be caught");
} catch (const std::exception& e) {
    // will caught the runtime error from main, but not from ~Q
    std::cerr << "caught: " << e.what() << std::endl;
}