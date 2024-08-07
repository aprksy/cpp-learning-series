# VCPKG
## Installation
1. Install via git
2. Setup environment variables

commands:
```bash
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg
echo "export VCPKG_ROOT=$(pwd)" >> ~/.zshrc
echo "export PATH=$VCPKG_ROOT:$PATH" >> ~/.zshrc
source ~/.zshrc
```

## Use in an example project
1. Create project directory `helloworld`
2. Initialize project with vcpkg
3. Import some dependency: fmt
4. Add MakeLists.txt

```bash
mkdir helloworld && cd helloworld
vcpkg new --application
vcpkg add port fmt
```
CMakeLists.txt:
```cmake
cmake_minimum_required(VERSION 3.10)
project(Helloworld)
find_package(fmt CONFIG REQUIRED)
add_executable(${PROJECT_NAME} main.cpp)
target_link_libraries(${PROJECT_NAME} PRIVATE fmt::fmt)
```
CMakePresets.json
```json
{
    "version": 2,
    "configurePresets": [
        {
            "name": "default",
            "generator": "Ninja",
            "binaryDir": "${sourceDir}/build",
            "cacheVariables": {
                "CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
            }
        }
    ]
}
```

Build command:
```bash
cmake --preset=default
cmake --build build
```