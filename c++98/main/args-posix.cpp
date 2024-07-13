#include <iostream>

int main(int argc, char** argv, char** envp) {
    for (char** iter=envp; *iter!=nullptr; ++iter) {
        std::cout << *iter << std::endl;
    }
}