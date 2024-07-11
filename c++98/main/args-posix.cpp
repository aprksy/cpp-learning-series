#include <iostream>

int main(int argc, char* argv [], char* envp[]) {
    int i = 0;
    while (envp[i] != nullptr) {
        std::cout << envp[i] << std::endl;
        ++i;
    }
}