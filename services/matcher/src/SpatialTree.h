#ifndef SPATIAL_TREE_H
#define SPATIAL_TREE_H

#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <memory>
#include <limits>

struct Volunteer {
    std::string id;
    double lat;
    double lng;
    std::vector<std::string> skills;
};

struct KDNode {
    Volunteer volunteer;
    std::unique_ptr<KDNode> left;
    std::unique_ptr<KDNode> right;
    int axis;

    KDNode(Volunteer v, int ax) : volunteer(v), left(nullptr), right(nullptr), axis(ax) {}
};

class SpatialTree {
public:
    SpatialTree();
    void build(const std::vector<Volunteer>& volunteers);
    Volunteer findNearest(double lat, double lng, const std::string& requiredSkill);

private:
    std::unique_ptr<KDNode> root;
    std::unique_ptr<KDNode> buildRecursive(std::vector<Volunteer>& pts, int depth);
    void nearestRecursive(KDNode* node, double targetLat, double targetLng, const std::string& requiredSkill, int depth, KDNode*& bestNode, double& bestDist);
    double distance(double lat1, double lng1, double lat2, double lng2);
};

#endif // SPATIAL_TREE_H
