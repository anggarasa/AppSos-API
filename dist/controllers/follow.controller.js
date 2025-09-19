"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowStatistics = exports.getFollowingList = exports.getFollowersList = exports.unfollow = exports.follow = void 0;
const follow_service_1 = require("../services/follow.service");
const follow = async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        const result = await (0, follow_service_1.followUser)(followerId, followingId);
        return res.status(201).json({
            status: 201,
            message: "Successfully followed user",
            data: result
        });
    }
    catch (error) {
        if (error.message === 'Follower user not found' || error.message === 'Following user not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'Cannot follow yourself') {
            return res.status(400).json({
                status: 400,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'Already following this user') {
            return res.status(409).json({
                status: 409,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.follow = follow;
const unfollow = async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        const result = await (0, follow_service_1.unfollowUser)(followerId, followingId);
        return res.status(200).json({
            status: 200,
            message: result.message,
            data: {}
        });
    }
    catch (error) {
        if (error.message === 'Follow relationship not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.unfollow = unfollow;
const getFollowersList = async (req, res) => {
    const { userId } = req.params;
    try {
        const followers = await (0, follow_service_1.getFollowers)(userId);
        return res.status(200).json({
            status: 200,
            message: "Followers retrieved successfully",
            data: followers
        });
    }
    catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.getFollowersList = getFollowersList;
const getFollowingList = async (req, res) => {
    const { userId } = req.params;
    try {
        const following = await (0, follow_service_1.getFollowing)(userId);
        return res.status(200).json({
            status: 200,
            message: "Following list retrieved successfully",
            data: following
        });
    }
    catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.getFollowingList = getFollowingList;
const getFollowStatistics = async (req, res) => {
    const { userId } = req.params;
    try {
        const stats = await (0, follow_service_1.getFollowStats)(userId);
        return res.status(200).json({
            status: 200,
            message: "Follow statistics retrieved successfully",
            data: stats
        });
    }
    catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.getFollowStatistics = getFollowStatistics;
//# sourceMappingURL=follow.controller.js.map