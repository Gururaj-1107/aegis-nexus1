#include "SpatialTree.h"

SpatialTree::SpatialTree() : root(nullptr) {}

void SpatialTree::build(const std::vector<Volunteer>& volunteers) {
    if (volunteers.empty()) {
        root = nullptr;
        return;
    }
    std::vector<Volunteer> mutableVols = volunteers;
    root = buildRecursive(mutableVols, 0);
}

std::unique_ptr<KDNode> SpatialTree::buildRecursive(std::vector<Volunteer>& pts, int depth) {
    if (pts.empty()) return nullptr;

    const int k = 2; // lat and lng
    int axis = depth % k;

    auto cmp = [axis](const Volunteer& a, const Volunteer& b) {
        if (axis == 0) return a.lat < b.lat;
        return a.lng < b.lng;
    };

    size_t medianIdx = pts.size() / 2;
    std::nth_element(pts.begin(), pts.begin() + medianIdx, pts.end(), cmp);

    std::unique_ptr<KDNode> node = std::make_unique<KDNode>(pts[medianIdx], axis);

    std::vector<Volunteer> leftPts(pts.begin(), pts.begin() + medianIdx);
    std::vector<Volunteer> rightPts(pts.begin() + medianIdx + 1, pts.end());

    node->left = buildRecursive(leftPts, depth + 1);
    node->right = buildRecursive(rightPts, depth + 1);

    return node;
}

// Haversine formula (or simple Euclidean for small dist)
// Here building Euclidean for performance as spatial optimization requirement states "fast I/O"
double SpatialTree::distance(double lat1, double lng1, double lat2, double lng2) {
    double dlat = lat1 - lat2;
    double dlng = lng1 - lng2;
    return dlat * dlat + dlng * dlng;
}

Volunteer SpatialTree::findNearest(double lat, double lng, const std::string& requiredSkill) {
    KDNode* bestNode = nullptr;
    double bestDist = std::numeric_limits<double>::max();
    nearestRecursive(root.get(), lat, lng, requiredSkill, 0, bestNode, bestDist);
    if (bestNode) return bestNode->volunteer;
    
    // Return empty if not found
    return {"", 0.0, 0.0, {}};
}

void SpatialTree::nearestRecursive(KDNode* node, double targetLat, double targetLng, const std::string& requiredSkill, int depth, KDNode*& bestNode, double& bestDist) {
    if (!node) return;

    // Check if node has required skill
    bool hasSkill = false;
    for (const auto& skill : node->volunteer.skills) {
        if (skill == requiredSkill) {
            hasSkill = true;
            break;
        }
    }

    if (hasSkill) {
        double d = distance(targetLat, targetLng, node->volunteer.lat, node->volunteer.lng);
        if (d < bestDist) {
            bestDist = d;
            bestNode = node;
        }
    }

    int axis = depth % 2;
    double axisDist = (axis == 0) ? (targetLat - node->volunteer.lat) : (targetLng - node->volunteer.lng);

    KDNode* first = (axisDist < 0) ? node->left.get() : node->right.get();
    KDNode* second = (axisDist < 0) ? node->right.get() : node->left.get();

    nearestRecursive(first, targetLat, targetLng, requiredSkill, depth + 1, bestNode, bestDist);

    if (axisDist * axisDist < bestDist) {
        nearestRecursive(second, targetLat, targetLng, requiredSkill, depth + 1, bestNode, bestDist);
    }
}
