#include <ranges>
#include <iostream>

int main() {
    auto ints = std::ranges::iota_view(1, 30);
    for (int num:ints | std::views::filter([](int x){ return x % 2 == 0; }) | std::views::transform([](int x) { return x * x; })) {
        std::cout << num << " ";
    }
}