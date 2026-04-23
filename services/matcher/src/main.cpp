#include "crow.h"
#include "nlohmann/json.hpp"
#include "SpatialTree.h"
#include <iostream>

using json = nlohmann::json;

SpatialTree tree;

int main() {
    crow::SimpleApp app;

    // Health check
    CROW_ROUTE(app, "/")([](){
        return "C++ Matcher Service is running (Crow Framework)";
    });

    // Endpoint to update tree with candidates
    CROW_ROUTE(app, "/build").methods(crow::HTTPMethod::POST)([](const crow::request& req){
        try {
            auto j = json::parse(req.body);
            std::vector<Volunteer> volunteers;
            for (const auto& item : j["volunteers"]) {
                Volunteer v;
                v.id = item["id"];
                v.lat = item["lat"];
                v.lng = item["lng"];
                for (const auto& s : item["skills"]) {
                    v.skills.push_back(s);
                }
                volunteers.push_back(v);
            }
            tree.build(volunteers);
            
            crow::json::wvalue response;
            response["status"] = "ok";
            response["count"] = volunteers.size();
            return crow::response(200, response);
        } catch (const std::exception& e) {
            crow::json::wvalue error;
            error["error"] = e.what();
            return crow::response(400, error);
        }
    });

    // Endpoint to match nearest
    CROW_ROUTE(app, "/match").methods(crow::HTTPMethod::POST)([](const crow::request& req){
        try {
            auto j = json::parse(req.body);
            double lat = j["lat"];
            double lng = j["lng"];
            std::string skill = j["skill"];

            Volunteer best = tree.findNearest(lat, lng, skill);

            crow::json::wvalue response;
            if (best.id.empty()) {
                response["status"] = "not_found";
                return crow::response(404, response);
            } else {
                response["status"] = "found";
                response["volunteer"]["id"] = best.id;
                response["volunteer"]["lat"] = best.lat;
                response["volunteer"]["lng"] = best.lng;
                return crow::response(200, response);
            }
        } catch (const std::exception& e) {
            crow::json::wvalue error;
            error["error"] = e.what();
            return crow::response(400, error);
        }
    });

    app.port(8080).multithreaded().run();

    return 0;
}
