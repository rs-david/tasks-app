/*
 Navicat Premium Data Transfer

 Source Server         : Local
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : tasks-app

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 27/04/2020 00:24:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `created` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 102 CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO `tasks` VALUES (1, 'Marjorie', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (2, 'Baxter', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (3, 'Johanna', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (4, 'Greta', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (5, 'Myrna', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (6, 'Mcdaniel', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (7, 'Murray', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (8, 'Macdonald', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (9, 'Michelle', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (10, 'Brandie', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (11, 'Alexandra', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (12, 'Atkinson', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (13, 'Yvette', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (14, 'Meyers', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (15, 'Simmons', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (16, 'Mcbride', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (17, 'Reba', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (18, 'Mari', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (19, 'Williamson', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (20, 'Holder', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (21, 'Kline', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (22, 'Barrera', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (23, 'Wise', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (24, 'Wolf', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (25, 'Willa', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (26, 'Monroe', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (27, 'Eve', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (28, 'Louisa', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (29, 'Fern', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (30, 'Pate', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (31, 'Valenzuela', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (32, 'Copeland', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (33, 'Bowen', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (34, 'Joanne', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (35, 'Kemp', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (36, 'Henry', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (37, 'Green', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (38, 'Peck', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (39, 'Brianna', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (40, 'Lena', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (41, 'Maria', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (42, 'Terrie', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (43, 'Leta', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (44, 'Traci', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (45, 'Benton', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (46, 'Corine', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (47, 'Henderson', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (48, 'Patty', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (49, 'Kari', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (50, 'Fowler', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (51, 'Luella', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (52, 'Rhodes', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (53, 'Morrison', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (54, 'Lester', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (55, 'Bender', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (56, 'Goldie', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (57, 'Sutton', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (58, 'Christensen', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (59, 'Arnold', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (60, 'Robbie', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (61, 'Nellie', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (62, 'Maribel', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (63, 'Jerry', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (64, 'Mullen', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (65, 'Inez', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (66, 'Reese', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (67, 'Angelita', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (68, 'Watkins', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (69, 'Frazier', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (70, 'Pittman', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (71, 'Jacobs', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (72, 'Travis', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (73, 'Julie', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (74, 'Shauna', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (75, 'Tami', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (76, 'Hopper', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (77, 'Cynthia', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (78, 'Ingram', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (79, 'Ware', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (80, 'Oconnor', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (81, 'Luann', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (82, 'Johnston', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (83, 'Mathews', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (84, 'Parrish', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (85, 'Ratliff', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (86, 'Karen', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (87, 'Haney', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (88, 'Kelsey', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (89, 'Cora', 'apple', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (90, 'Rosario', 'orange', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (91, 'Pena', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (92, 'Warner', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (93, 'Deloris', 'grapes', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (94, 'Maude', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (95, 'Chavez', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (96, 'Lori', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (97, 'Larson', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (98, 'Anastasia', 'banana', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (99, 'Warren', 'strawberry', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (100, 'Sloan', 'melon', '2020-04-27 00:20:47');
INSERT INTO `tasks` VALUES (101, 'Lee', 'apple', '2020-04-27 00:20:47');

SET FOREIGN_KEY_CHECKS = 1;
