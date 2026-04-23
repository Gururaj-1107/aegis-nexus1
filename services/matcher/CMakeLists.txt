cmake_minimum_required(VERSION 3.10)
project(matcher_service)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include(FetchContent)

# JSON library for SpatialTree parsing
FetchContent_Declare(
  json
  URL https://github.com/nlohmann/json/releases/download/v3.11.2/json.tar.xz
)
FetchContent_MakeAvailable(json)

# Crow Framework — GIT_SHALLOW clones only the tip commit (fast, no full history)
FetchContent_Declare(
  Crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG        v1.0+5
  GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(Crow)

add_executable(matcher_service src/main.cpp src/SpatialTree.cpp)

target_link_libraries(matcher_service PRIVATE nlohmann_json::nlohmann_json Crow::Crow pthread)
