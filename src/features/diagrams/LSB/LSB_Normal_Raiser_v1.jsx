import Switchgear from "../../../ui/Switchgear";
import Panelboard from "../../../ui/Panelboard";
import Transformer from "../../../ui/Transformer";
import Arrow_line from "../../../ui/Arrow_line";
import PanelboardGroup from "../../../ui/PanelboardGroup";
import React from "react";
import { useDevicesByProjectId } from "../../devices/useDevices";

const X_Level_Start = -800;
const X_Level_End = 4500;

const Y_Level_8 = 330;
const Y_Level_7 = 330 * 2;
const Y_Level_6 = 330 * 3;
const Y_Level_5 = 330 * 4;
const Y_Level_4 = 330 * 5;
const Y_Level_3 = 330 * 6;
const Y_Level_2 = 330 * 7;
const Y_Level_1 = 330 * 8;
const Y_Level_0 = 330 * 9;

const X_Normal_ER_East = 2300;
const Y_Normal_ER_East = 330 * 8;
const X_Normal_ER_East2 = 1600;

const X_Normal_ER_West = 250;
const X_Normal_ER_West2 = X_Level_Start + 50;

const fixedSwitchgearList = [
  { name: "USS-LSB-1", x: 0, y: 0 },
  { name: "USS-LSB-2", x: 1600, y: 0 },
  { name: "MSWGA-1", x: 2400, y: Y_Level_1 },
];
const X_PanelGroup1 = 2400;
const fixedPanelList = [
  { name: "P2PC1", x: X_PanelGroup1, y: 0 },
  { name: "DP2PC1", x: X_PanelGroup1 - 100, y: 0 },
  { name: "DP4PC1", x: X_PanelGroup1 - 200, y: 0 },
  { name: "P4PC1", x: X_PanelGroup1 - 300, y: 0 },
];

const X_PanelGroup2 = 1400;
const fixedPanelList2 = [
  { name: "P2PD1", x: X_PanelGroup2, y: 0 },
  { name: "DP2PD1", x: X_PanelGroup2 - 100, y: 0 },
  { name: "DP4PD1", x: X_PanelGroup2 - 200, y: 0 },
  { name: "P4PD1", x: X_PanelGroup2 - 300, y: 0 },
];

const X_PanelGroup3 = 800;
const fixedPanelList3 = [
  { name: "DP4LB", x: X_PanelGroup3 + 100, y: 0 },
  { name: "P2PB1", x: X_PanelGroup3, y: 0 },
  { name: "DP2PB1", x: X_PanelGroup3 - 100, y: 0 },
  { name: "DP4PB1", x: X_PanelGroup3 - 200, y: 0 },
  { name: "P4PB1", x: X_PanelGroup3 - 300, y: 0 },
];

const X_PanelGroup4 = -100;
const fixedPanelList4 = [
  { name: "P2PA1", x: X_PanelGroup4, y: 0 },
  { name: "DP2PA1", x: X_PanelGroup4 - 100, y: 0 },
  { name: "DP4PA1", x: X_PanelGroup4 - 200, y: 0 },
  { name: "P4PA1", x: X_PanelGroup4 - 300, y: 0 },
  { name: "DP4LA", x: X_PanelGroup4 - 400, y: 0 },
  { name: "L4P", x: X_PanelGroup4 - 500, y: 0 },
];

const X_PanelGroup_Level7 = X_PanelGroup1 + 1000;
const fixedPanelList_Level_7 = [
  { name: "P2PC2", x: X_PanelGroup_Level7, y: Y_Level_7 - 250 },
  { name: "P4PC2", x: X_PanelGroup_Level7 - 100, y: Y_Level_7 - 250 },
];

const fixedPanelList_Level_7_2 = [
  { name: "P2PD2", x: X_PanelGroup_Level7 - 500, y: Y_Level_7 - 250 },
  { name: "P4PD2", x: X_PanelGroup_Level7 - 600, y: Y_Level_7 - 250 },
];

const X_PanelGroup_Level6 = X_PanelGroup1 + 500;
const fixedPanelList_Level_6 = [
  { name: "LAB26E4", x: X_PanelGroup_Level6, y: Y_Level_6 - 250 },
  { name: "LAB26E3", x: X_PanelGroup_Level6 - 100, y: Y_Level_6 - 250 },
  { name: "LAB26E2", x: X_PanelGroup_Level6 - 200, y: Y_Level_6 - 250 },
  { name: "LAB26E1", x: X_PanelGroup_Level6 - 300, y: Y_Level_6 - 250 },
  { name: "P26E2", x: X_PanelGroup_Level6 - 500, y: Y_Level_6 - 250 },
];

const fixedPanelList_Level_6_2 = [
  { name: "P26E1", x: X_PanelGroup_Level6 - 800, y: Y_Level_6 - 250 },
  { name: "DP26E", x: X_PanelGroup_Level6 - 900, y: Y_Level_6 - 250 },
  { name: "L46E", x: X_PanelGroup_Level6 - 1200, y: Y_Level_6 - 250 },
];

const X_PanelGroup_Level6_West = X_PanelGroup3;
const fixedPanelList_Level_6_3 = [
  { name: "LAB26W4", x: X_PanelGroup_Level6_West, y: Y_Level_6 - 250 },
  { name: "LAB26W3", x: X_PanelGroup_Level6_West - 100, y: Y_Level_6 - 250 },
  { name: "LAB26W2", x: X_PanelGroup_Level6_West - 200, y: Y_Level_6 - 250 },
  { name: "LAB26W1", x: X_PanelGroup_Level6_West - 300, y: Y_Level_6 - 250 },
  { name: "P26W2", x: X_PanelGroup_Level6_West - 500, y: Y_Level_6 - 250 },
];

const fixedPanelList_Level_6_4 = [
  { name: "P26W1", x: X_PanelGroup_Level6_West - 1000, y: Y_Level_6 - 250 },
  { name: "DP26W", x: X_PanelGroup_Level6_West - 1100, y: Y_Level_6 - 250 },
  { name: "L46W", x: X_PanelGroup_Level6_West - 1500, y: Y_Level_6 - 250 },
];

const X_PanelGroup_Level5 = X_PanelGroup1 + 1200;
const fixedPanelList_Level_5 = [
  { name: "LAB25E13", x: X_PanelGroup_Level5, y: Y_Level_5 - 300 },
  { name: "LAB25E12", x: X_PanelGroup_Level5 - 100, y: Y_Level_5 - 300 },
  { name: "LAB25E11", x: X_PanelGroup_Level5 - 200, y: Y_Level_5 - 300 },
  { name: "LAB25E10", x: X_PanelGroup_Level5 - 300, y: Y_Level_5 - 300 },
  { name: "LAB25E9", x: X_PanelGroup_Level5 - 400, y: Y_Level_5 - 300 },
  { name: "LAB25E8", x: X_PanelGroup_Level5 - 500, y: Y_Level_5 - 300 },
  { name: "LAB25E7", x: X_PanelGroup_Level5 - 0, y: Y_Level_5 - 150 },
  { name: "LAB25E6", x: X_PanelGroup_Level5 - 100, y: Y_Level_5 - 150 },
  { name: "LAB25E5", x: X_PanelGroup_Level5 - 200, y: Y_Level_5 - 150 },
  { name: "LAB25E4", x: X_PanelGroup_Level5 - 300, y: Y_Level_5 - 150 },
  { name: "LAB25E3", x: X_PanelGroup_Level5 - 400, y: Y_Level_5 - 150 },
  { name: "LAB25E2", x: X_PanelGroup_Level5 - 500, y: Y_Level_5 - 150 },
  { name: "LAB25E1", x: X_PanelGroup_Level5 - 600, y: Y_Level_5 - 150 },
  { name: "P25E3", x: X_PanelGroup_Level5 - 1000, y: Y_Level_5 - 200 },
  { name: "P25E2", x: X_PanelGroup_Level5 - 1100, y: Y_Level_5 - 200 },
];

const fixedPanelList_Level_5_2 = [
  { name: "P25E1", x: X_PanelGroup_Level5 - 800 - 700, y: Y_Level_5 - 250 },
  { name: "DP25E", x: X_PanelGroup_Level5 - 900 - 700, y: Y_Level_5 - 250 },
  { name: "L45E", x: X_PanelGroup_Level5 - 1200 - 700, y: Y_Level_5 - 250 },
];

const X_PanelGroup_Level5_West = X_PanelGroup3 + 600;
const fixedPanelList_Level_5_3 = [
  { name: "LAB25W13", x: X_PanelGroup_Level5_West, y: Y_Level_5 - 300 },
  { name: "LAB25W12", x: X_PanelGroup_Level5_West - 100, y: Y_Level_5 - 300 },
  { name: "LAB25W11", x: X_PanelGroup_Level5_West - 200, y: Y_Level_5 - 300 },
  { name: "LAB25W10", x: X_PanelGroup_Level5_West - 300, y: Y_Level_5 - 300 },
  { name: "LAB25W9", x: X_PanelGroup_Level5_West - 400, y: Y_Level_5 - 300 },
  { name: "LAB25W8", x: X_PanelGroup_Level5_West - 500, y: Y_Level_5 - 300 },
  { name: "LAB25W7", x: X_PanelGroup_Level5_West - 0, y: Y_Level_5 - 150 },
  { name: "LAB25W6", x: X_PanelGroup_Level5_West - 100, y: Y_Level_5 - 150 },
  { name: "LAB25W5", x: X_PanelGroup_Level5_West - 200, y: Y_Level_5 - 150 },
  { name: "LAB25W4", x: X_PanelGroup_Level5_West - 300, y: Y_Level_5 - 150 },
  { name: "LAB25W3", x: X_PanelGroup_Level5_West - 400, y: Y_Level_5 - 150 },
  { name: "LAB25W2", x: X_PanelGroup_Level5_West - 500, y: Y_Level_5 - 150 },
  { name: "LAB25W1", x: X_PanelGroup_Level5_West - 600, y: Y_Level_5 - 150 },
  { name: "P25W3", x: X_PanelGroup_Level5_West - 1000, y: Y_Level_5 - 200 },
  { name: "P25W2", x: X_PanelGroup_Level5_West - 1100, y: Y_Level_5 - 200 },
];
const fixedPanelList_Level_5_4 = [
  {
    name: "P25W1",
    x: X_PanelGroup_Level5_West - 800 - 700,
    y: Y_Level_5 - 250,
  },
  {
    name: "DP25W",
    x: X_PanelGroup_Level5_West - 900 - 700,
    y: Y_Level_5 - 250,
  },
  {
    name: "L45W",
    x: X_PanelGroup_Level5_West - 1200 - 700,
    y: Y_Level_5 - 250,
  },
];

const X_PanelGroup_Level4 = X_PanelGroup_Level5;
const fixedPanelList_Level_4 = [
  { name: "LAB24E13", x: X_PanelGroup_Level4, y: Y_Level_4 - 300 },
  { name: "LAB24E12", x: X_PanelGroup_Level4 - 100, y: Y_Level_4 - 300 },
  { name: "LAB24E11", x: X_PanelGroup_Level4 - 200, y: Y_Level_4 - 300 },
  { name: "LAB24E10", x: X_PanelGroup_Level4 - 300, y: Y_Level_4 - 300 },
  { name: "LAB24E9", x: X_PanelGroup_Level4 - 400, y: Y_Level_4 - 300 },
  { name: "LAB24E8", x: X_PanelGroup_Level4 - 500, y: Y_Level_4 - 300 },
  { name: "LAB24E7", x: X_PanelGroup_Level4 - 0, y: Y_Level_4 - 150 },
  { name: "LAB24E6", x: X_PanelGroup_Level4 - 100, y: Y_Level_4 - 150 },
  { name: "LAB24E5", x: X_PanelGroup_Level4 - 200, y: Y_Level_4 - 150 },
  { name: "LAB24E4", x: X_PanelGroup_Level4 - 300, y: Y_Level_4 - 150 },
  { name: "LAB24E3", x: X_PanelGroup_Level4 - 400, y: Y_Level_4 - 150 },
  { name: "LAB24E2", x: X_PanelGroup_Level4 - 500, y: Y_Level_4 - 150 },
  { name: "LAB24E1", x: X_PanelGroup_Level4 - 600, y: Y_Level_4 - 150 },
  { name: "P24E3", x: X_PanelGroup_Level4 - 1000, y: Y_Level_4 - 200 },
  { name: "P24E2", x: X_PanelGroup_Level4 - 1100, y: Y_Level_4 - 200 },
];

const fixedPanelList_Level_4_2 = [
  { name: "P24E1", x: X_PanelGroup_Level4 - 800 - 700, y: Y_Level_4 - 250 },
  { name: "DP24E", x: X_PanelGroup_Level4 - 900 - 700, y: Y_Level_4 - 250 },
  { name: "L44E", x: X_PanelGroup_Level4 - 1200 - 700, y: Y_Level_4 - 250 },
];

const X_PanelGroup_Level4_West = X_PanelGroup_Level5_West;
const fixedPanelList_Level_4_3 = [
  { name: "LAB24W13", x: X_PanelGroup_Level4_West, y: Y_Level_4 - 300 },
  { name: "LAB24W12", x: X_PanelGroup_Level4_West - 100, y: Y_Level_4 - 300 },
  { name: "LAB24W11", x: X_PanelGroup_Level4_West - 200, y: Y_Level_4 - 300 },
  { name: "LAB24W10", x: X_PanelGroup_Level4_West - 300, y: Y_Level_4 - 300 },
  { name: "LAB24W9", x: X_PanelGroup_Level4_West - 400, y: Y_Level_4 - 300 },
  { name: "LAB24W8", x: X_PanelGroup_Level4_West - 500, y: Y_Level_4 - 300 },
  { name: "LAB24W7", x: X_PanelGroup_Level4_West - 0, y: Y_Level_4 - 150 },
  { name: "LAB24W6", x: X_PanelGroup_Level4_West - 100, y: Y_Level_4 - 150 },
  { name: "LAB24W5", x: X_PanelGroup_Level4_West - 200, y: Y_Level_4 - 150 },
  { name: "LAB24W4", x: X_PanelGroup_Level4_West - 300, y: Y_Level_4 - 150 },
  { name: "LAB24W3", x: X_PanelGroup_Level4_West - 400, y: Y_Level_4 - 150 },
  { name: "LAB24W2", x: X_PanelGroup_Level4_West - 500, y: Y_Level_4 - 150 },
  { name: "LAB24W1", x: X_PanelGroup_Level4_West - 600, y: Y_Level_4 - 150 },
  { name: "P24W3", x: X_PanelGroup_Level4_West - 1000, y: Y_Level_4 - 200 },
  { name: "P24W2", x: X_PanelGroup_Level4_West - 1100, y: Y_Level_4 - 200 },
];
const fixedPanelList_Level_4_4 = [
  {
    name: "P24W1",
    x: X_PanelGroup_Level4_West - 800 - 700,
    y: Y_Level_4 - 250,
  },
  {
    name: "DP24W",
    x: X_PanelGroup_Level4_West - 900 - 700,
    y: Y_Level_4 - 250,
  },
  {
    name: "L44W",
    x: X_PanelGroup_Level4_West - 1200 - 700,
    y: Y_Level_4 - 250,
  },
];

const X_PanelGroup_Level3 = X_PanelGroup_Level4;
const fixedPanelList_Level_3 = [
  { name: "LAB23E13", x: X_PanelGroup_Level3, y: Y_Level_3 - 300 },
  { name: "LAB23E12", x: X_PanelGroup_Level3 - 100, y: Y_Level_3 - 300 },
  { name: "LAB23E11", x: X_PanelGroup_Level3 - 200, y: Y_Level_3 - 300 },
  { name: "LAB23E10", x: X_PanelGroup_Level3 - 300, y: Y_Level_3 - 300 },
  { name: "LAB23E9", x: X_PanelGroup_Level3 - 400, y: Y_Level_3 - 300 },
  { name: "LAB23E8", x: X_PanelGroup_Level3 - 500, y: Y_Level_3 - 300 },
  { name: "LAB23E7", x: X_PanelGroup_Level3 - 0, y: Y_Level_3 - 150 },
  { name: "LAB23E6", x: X_PanelGroup_Level3 - 100, y: Y_Level_3 - 150 },
  { name: "LAB23E5", x: X_PanelGroup_Level3 - 200, y: Y_Level_3 - 150 },
  { name: "LAB23E4", x: X_PanelGroup_Level3 - 300, y: Y_Level_3 - 150 },
  { name: "LAB23E3", x: X_PanelGroup_Level3 - 400, y: Y_Level_3 - 150 },
  { name: "LAB23E2", x: X_PanelGroup_Level3 - 500, y: Y_Level_3 - 150 },
  { name: "LAB23E1", x: X_PanelGroup_Level3 - 600, y: Y_Level_3 - 150 },
  { name: "P23E3", x: X_PanelGroup_Level3 - 1000, y: Y_Level_3 - 200 },
  { name: "P23E2", x: X_PanelGroup_Level3 - 1100, y: Y_Level_3 - 200 },
];

const fixedPanelList_Level_3_2 = [
  { name: "P23E1", x: X_PanelGroup_Level3 - 800 - 700, y: Y_Level_3 - 250 },
  { name: "DP23E", x: X_PanelGroup_Level3 - 900 - 700, y: Y_Level_3 - 250 },
  { name: "L43E", x: X_PanelGroup_Level3 - 1200 - 700, y: Y_Level_3 - 250 },
];

const X_PanelGroup_Level3_West = X_PanelGroup_Level5_West;
const fixedPanelList_Level_3_3 = [
  { name: "LAB23W13", x: X_PanelGroup_Level3_West, y: Y_Level_3 - 300 },
  { name: "LAB23W12", x: X_PanelGroup_Level3_West - 100, y: Y_Level_3 - 300 },
  { name: "LAB23W11", x: X_PanelGroup_Level3_West - 200, y: Y_Level_3 - 300 },
  { name: "LAB23W10", x: X_PanelGroup_Level3_West - 300, y: Y_Level_3 - 300 },
  { name: "LAB23W9", x: X_PanelGroup_Level3_West - 400, y: Y_Level_3 - 300 },
  { name: "LAB23W8", x: X_PanelGroup_Level3_West - 500, y: Y_Level_3 - 300 },
  { name: "LAB23W7", x: X_PanelGroup_Level3_West - 0, y: Y_Level_3 - 150 },
  { name: "LAB23W6", x: X_PanelGroup_Level3_West - 100, y: Y_Level_3 - 150 },
  { name: "LAB23W5", x: X_PanelGroup_Level3_West - 200, y: Y_Level_3 - 150 },
  { name: "LAB23W4", x: X_PanelGroup_Level3_West - 300, y: Y_Level_3 - 150 },
  { name: "LAB23W3", x: X_PanelGroup_Level3_West - 400, y: Y_Level_3 - 150 },
  { name: "LAB23W2", x: X_PanelGroup_Level3_West - 500, y: Y_Level_3 - 150 },
  { name: "LAB23W1", x: X_PanelGroup_Level3_West - 600, y: Y_Level_3 - 150 },
  { name: "P23W3", x: X_PanelGroup_Level3_West - 1000, y: Y_Level_3 - 200 },
  { name: "P23W2", x: X_PanelGroup_Level3_West - 1100, y: Y_Level_3 - 200 },
];
const fixedPanelList_Level_3_4 = [
  {
    name: "P23W1",
    x: X_PanelGroup_Level3_West - 800 - 700,
    y: Y_Level_3 - 250,
  },
  {
    name: "DP23W",
    x: X_PanelGroup_Level3_West - 900 - 700,
    y: Y_Level_3 - 250,
  },
  {
    name: "L43W",
    x: X_PanelGroup_Level3_West - 1200 - 700,
    y: Y_Level_3 - 250,
  },
];

const X_PanelGroup_Level2 = X_PanelGroup_Level3;
const fixedPanelList_Level_2 = [
  { name: "LAB22E13", x: X_PanelGroup_Level2, y: Y_Level_2 - 300 },
  { name: "LAB22E12", x: X_PanelGroup_Level2 - 100, y: Y_Level_2 - 300 },
  { name: "LAB22E11", x: X_PanelGroup_Level2 - 200, y: Y_Level_2 - 300 },
  { name: "LAB22E10", x: X_PanelGroup_Level2 - 300, y: Y_Level_2 - 300 },
  { name: "LAB22E9", x: X_PanelGroup_Level2 - 400, y: Y_Level_2 - 300 },
  { name: "LAB22E8", x: X_PanelGroup_Level2 - 500, y: Y_Level_2 - 300 },
  { name: "LAB22E7", x: X_PanelGroup_Level2 - 0, y: Y_Level_2 - 150 },
  { name: "LAB22E6", x: X_PanelGroup_Level2 - 100, y: Y_Level_2 - 150 },
  { name: "LAB22E5", x: X_PanelGroup_Level2 - 200, y: Y_Level_2 - 150 },
  { name: "LAB22E4", x: X_PanelGroup_Level2 - 300, y: Y_Level_2 - 150 },
  { name: "LAB22E3", x: X_PanelGroup_Level2 - 400, y: Y_Level_2 - 150 },
  { name: "LAB22E2", x: X_PanelGroup_Level2 - 500, y: Y_Level_2 - 150 },
  { name: "LAB22E1", x: X_PanelGroup_Level2 - 600, y: Y_Level_2 - 150 },
  { name: "P22E3", x: X_PanelGroup_Level2 - 1000, y: Y_Level_2 - 200 },
  { name: "P22E2", x: X_PanelGroup_Level2 - 1100, y: Y_Level_2 - 200 },
];

const fixedPanelList_Level_2_2 = [
  { name: "P22E1", x: X_PanelGroup_Level2 - 800 - 700, y: Y_Level_2 - 250 },
  { name: "DP22E", x: X_PanelGroup_Level2 - 900 - 700, y: Y_Level_2 - 250 },
  { name: "L42E", x: X_PanelGroup_Level2 - 1200 - 700, y: Y_Level_2 - 250 },
];

const X_PanelGroup_Level2_West = X_PanelGroup_Level5_West;
const fixedPanelList_Level_2_3 = [
  { name: "LAB22W13", x: X_PanelGroup_Level2_West, y: Y_Level_2 - 300 },
  { name: "LAB22W12", x: X_PanelGroup_Level2_West - 100, y: Y_Level_2 - 300 },
  { name: "LAB22W11", x: X_PanelGroup_Level2_West - 200, y: Y_Level_2 - 300 },
  { name: "LAB22W10", x: X_PanelGroup_Level2_West - 300, y: Y_Level_2 - 300 },
  { name: "LAB22W9", x: X_PanelGroup_Level2_West - 400, y: Y_Level_2 - 300 },
  { name: "LAB22W8", x: X_PanelGroup_Level2_West - 500, y: Y_Level_2 - 300 },
  { name: "LAB22W7", x: X_PanelGroup_Level2_West - 0, y: Y_Level_2 - 150 },
  { name: "LAB22W6", x: X_PanelGroup_Level2_West - 100, y: Y_Level_2 - 150 },
  { name: "LAB22W5", x: X_PanelGroup_Level2_West - 200, y: Y_Level_2 - 150 },
  { name: "LAB22W4", x: X_PanelGroup_Level2_West - 300, y: Y_Level_2 - 150 },
  { name: "LAB22W3", x: X_PanelGroup_Level2_West - 400, y: Y_Level_2 - 150 },
  { name: "LAB22W2", x: X_PanelGroup_Level2_West - 500, y: Y_Level_2 - 150 },
  { name: "LAB22W1", x: X_PanelGroup_Level2_West - 600, y: Y_Level_2 - 150 },
  { name: "P22W3", x: X_PanelGroup_Level2_West - 1000, y: Y_Level_2 - 200 },
  { name: "P22W2", x: X_PanelGroup_Level2_West - 1100, y: Y_Level_2 - 200 },
];
const fixedPanelList_Level_2_4 = [
  {
    name: "P22W1",
    x: X_PanelGroup_Level2_West - 800 - 700,
    y: Y_Level_2 - 250,
  },
  {
    name: "DP22W",
    x: X_PanelGroup_Level2_West - 900 - 700,
    y: Y_Level_2 - 250,
  },
  {
    name: "L42W",
    x: X_PanelGroup_Level2_West - 1200 - 700,
    y: Y_Level_2 - 250,
  },
];

const X_PanelGroup_Level1 = X_PanelGroup_Level2 - 200;
const fixedPanelList_Level_1 = [
  { name: "KP41E2", x: X_PanelGroup_Level1, y: Y_Level_1 - 150 },
  { name: "KP41E1", x: X_PanelGroup_Level1 - 100, y: Y_Level_1 - 150 },
  { name: "KP21E4", x: X_PanelGroup_Level1 - 200, y: Y_Level_1 - 150 },
  { name: "KP21E3", x: X_PanelGroup_Level1 - 300, y: Y_Level_1 - 150 },
  { name: "KP21E2", x: X_PanelGroup_Level1 - 400, y: Y_Level_1 - 150 },
  { name: "KP21E1", x: X_PanelGroup_Level1 - 500, y: Y_Level_1 - 150 },
  { name: "P21E2", x: X_PanelGroup_Level1 - 800, y: Y_Level_1 - 150 },
];

const fixedPanelList_Level_1_2 = [
  { name: "P21E1", x: X_PanelGroup_Level1 - 500 - 700, y: Y_Level_1 - 250 },
  { name: "DP21E", x: X_PanelGroup_Level1 - 600 - 700, y: Y_Level_1 - 250 },
  { name: "L41E", x: X_PanelGroup_Level1 - 1000 - 700, y: Y_Level_1 - 250 },
];

const X_PanelGroup_Level1_West = X_PanelGroup_Level5_West;
const fixedPanelList_Level_1_3 = [
  { name: "LAB21W6", x: X_PanelGroup_Level1_West - 100, y: Y_Level_1 - 150 },
  { name: "LAB21W5", x: X_PanelGroup_Level1_West - 200, y: Y_Level_1 - 150 },
  { name: "LAB21W4", x: X_PanelGroup_Level1_West - 300, y: Y_Level_1 - 150 },
  { name: "LAB21W3", x: X_PanelGroup_Level1_West - 400, y: Y_Level_1 - 150 },
  { name: "LAB21W2", x: X_PanelGroup_Level1_West - 500, y: Y_Level_1 - 150 },
  { name: "LAB21W1", x: X_PanelGroup_Level1_West - 600, y: Y_Level_1 - 150 },
  { name: "P21W3", x: X_PanelGroup_Level1_West - 1000, y: Y_Level_1 - 200 },
  { name: "P21W2", x: X_PanelGroup_Level1_West - 1100, y: Y_Level_1 - 200 },
];
const fixedPanelList_Level_1_4 = [
  {
    name: "P21W1",
    x: X_PanelGroup_Level1_West - 800 - 700,
    y: Y_Level_1 - 250,
  },
  {
    name: "DP21W",
    x: X_PanelGroup_Level1_West - 900 - 700,
    y: Y_Level_1 - 250,
  },
  {
    name: "L41W",
    x: X_PanelGroup_Level1_West - 1200 - 700,
    y: Y_Level_1 - 250,
  },
];

const X_PanelGroup_Level0 = 2150;
const fixedPanelList_Level_0 = [
  { name: "DP2BE2", x: X_PanelGroup_Level0, y: Y_Level_0 - 150 },
  { name: "P2BE3", x: X_PanelGroup_Level0 - 100, y: Y_Level_0 - 150 },
  { name: "P2BE2", x: X_PanelGroup_Level0 - 200, y: Y_Level_0 - 150 },
  { name: "P2BE1", x: X_PanelGroup_Level0 - 400, y: Y_Level_0 - 250 },
  { name: "DP2BE", x: X_PanelGroup_Level0 - 500, y: Y_Level_0 - 250 },
  { name: "L4BE", x: X_PanelGroup_Level0 - 700, y: Y_Level_0 - 250 },
  { name: "KDP21E2", x: X_PanelGroup_Level0 - 800, y: Y_Level_0 - 250 },
  { name: "KDP21E1", x: X_PanelGroup_Level0 - 1000, y: Y_Level_0 - 250 },
  { name: "KDP4BE", x: X_PanelGroup_Level0 - 1200, y: Y_Level_0 - 150 },
  { name: "P2BC1", x: X_PanelGroup_Level0 - 1400, y: Y_Level_0 - 250 },
  { name: "DP4BC1", x: X_PanelGroup_Level0 - 1500, y: Y_Level_0 - 250 },
  { name: "P4BC1", x: X_PanelGroup_Level0 - 1600, y: Y_Level_0 - 250 },
  { name: "P2BD1", x: X_PanelGroup_Level0 - 1800, y: Y_Level_0 - 250 },
  { name: "DP4BD1", x: X_PanelGroup_Level0 - 1900, y: Y_Level_0 - 250 },
  { name: "P4BD1", x: X_PanelGroup_Level0 - 2000, y: Y_Level_0 - 250 },
];

const switchgearData = [
  { name: "USS-LSB-1", energized: true },
  { name: "USS-LSB-2", energized: true },
  { name: "MSWGA-1", energized: true },
];
function LSB_Normal_Raiser() {
  const { isPending, devicesByProjectId } = useDevicesByProjectId(1);
  if (isPending) return null;
  const deviceMap = new Map(
    devicesByProjectId.map((item) => [item.name, item])
  );
  // console.log(deviceMap);
  const level_of_building = Array.from({ length: 9 }, (_, i) => i).reverse();
  return (
    <>
      <g transform={`translate(${X_Normal_ER_East}, ${Y_Normal_ER_East})`}>
        <line
          x1={0}
          y1={330 - Y_Normal_ER_East}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <g transform={`translate(${X_Normal_ER_East2}, ${Y_Normal_ER_East})`}>
        <line
          x1={0}
          y1={330 - Y_Normal_ER_East}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <Arrow_line
        x1={X_Normal_ER_East2}
        y1={360}
        x2={X_Normal_ER_East}
        y2={360}
        label="EAST NORMAL ELECTRICAL ROOM"
      />
      <g transform={`translate(${X_Normal_ER_West}, ${Y_Normal_ER_East})`}>
        <line
          x1={0}
          y1={330 - Y_Normal_ER_East}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <g transform={`translate(${X_Normal_ER_West2}, ${Y_Normal_ER_East})`}>
        <line
          x1={0}
          y1={330 - Y_Normal_ER_East}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <Arrow_line
        x1={X_Normal_ER_West}
        y1={360}
        x2={X_Normal_ER_West2}
        y2={360}
        label="West NORMAL ELECTRICAL ROOM"
      />
      {/* ****************************** Draw level line ******************************* */}
      {level_of_building.map((level, index) => {
        // console.log(level, index);
        return (
          <g
            key={index}
            transform={`translate(${X_Level_Start}, ${Y_Level_8 * (index + 1)})`}
          >
            <line
              x1={0}
              y1={0}
              x2={X_Level_End}
              y2={0}
              stroke="#555"
              strokeWidth={4}
            />
            <text
              x={X_Level_End}
              y={0 - 10}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
            >
              {`Level ${level}`}
            </text>
          </g>
        );
      })}
      {/*---------------------------------- Level 8 -------------------------------------------------------*/}

      {fixedSwitchgearList.map((item) => {
        const device = deviceMap?.get(item.name);
        return (
          <Switchgear
            key={item.name}
            name={item.name}
            x={item.x}
            y={item.y}
            energized={device?.energized ?? false}
          />
        );
      })}
      <PanelboardGroup devices={deviceMap} panelboards={fixedPanelList} />

      <Transformer x={X_PanelGroup1 - 150} y={230} name={"T6"} />
      <PanelboardGroup devices={deviceMap} panelboards={fixedPanelList2} />

      <Transformer x={X_PanelGroup2 - 150} y={230} name={"T6"} />
      <PanelboardGroup devices={deviceMap} panelboards={fixedPanelList3} />

      <Transformer x={X_PanelGroup3 - 150} y={230} name={"T6"} />

      <PanelboardGroup devices={deviceMap} panelboards={fixedPanelList4} />

      <Transformer x={X_PanelGroup4 - 150} y={230} name={"T6"} />
      <Panelboard
        name={"FPCB"}
        x={X_PanelGroup4 - 500}
        y={200}
        energized={false}
      />
      {/*---------------------------------- Level 7 -------------------------------------------------------*/}

      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_7}
      />
      <Transformer
        x={X_PanelGroup_Level7 - 50}
        y={Y_Level_7 - 100}
        name={"T4"}
      />

      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_7_2}
      />
      <Transformer
        x={X_PanelGroup_Level7 - 550}
        y={Y_Level_7 - 100}
        name={"T4"}
      />
      {/*---------------------------------- Level 6 -------------------------------------------------------*/}

      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_6}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_6_2}
      />
      <Transformer
        x={X_PanelGroup_Level6 - 850}
        y={Y_Level_6 - 100}
        name={"T8"}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_6_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_6_4}
      />
      <Transformer
        x={X_PanelGroup_Level6_West - 1050}
        y={Y_Level_6 - 100}
        name={"T8"}
      />

      {/*---------------------------------- Level 5 -------------------------------------------------------*/}

      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_5}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_5_2}
      />
      <Transformer
        x={X_PanelGroup_Level5 - 850 - 700}
        y={Y_Level_5 - 100}
        name={"T8"}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_5_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_5_4}
      />
      <Transformer
        x={X_PanelGroup_Level5_West - 850 - 700}
        y={Y_Level_5 - 100}
        name={"T8"}
      />
      {/*---------------------------------- Level 4 -------------------------------------------------------*/}
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_4}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_4_2}
      />
      <Transformer
        x={X_PanelGroup_Level4 - 850 - 700}
        y={Y_Level_4 - 100}
        name={"T8"}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_4_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_4_4}
      />
      <Transformer
        x={X_PanelGroup_Level4_West - 850 - 700}
        y={Y_Level_4 - 100}
        name={"T8"}
      />

      {/*---------------------------------- Level 3 -------------------------------------------------------*/}
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_3_2}
      />
      <Transformer
        x={X_PanelGroup_Level3 - 850 - 700}
        y={Y_Level_3 - 100}
        name={"T8"}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_3_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_3_4}
      />
      <Transformer
        x={X_PanelGroup_Level3_West - 850 - 700}
        y={Y_Level_3 - 100}
        name={"T8"}
      />

      {/*---------------------------------- Level 2 -------------------------------------------------------*/}
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_2}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_2_2}
      />
      <Transformer
        x={X_PanelGroup_Level2 - 850 - 700}
        y={Y_Level_2 - 100}
        name={"T8"}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_2_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_2_4}
      />
      <Transformer
        x={X_PanelGroup_Level2_West - 850 - 700}
        y={Y_Level_2 - 100}
        name={"T8"}
      />

      {/*---------------------------------- Level 1 -------------------------------------------------------*/}
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_1}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_1_2}
      />
      <Transformer
        x={X_PanelGroup_Level1 - 650 - 700}
        y={Y_Level_1 - 100}
        name={"T8"}
      />
      <Transformer
        x={X_PanelGroup_Level1 - 750 - 700}
        y={Y_Level_1 - 300}
        name={"T5"}
      />

      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_1_3}
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_1_4}
      />
      <Transformer
        x={X_PanelGroup_Level1_West - 850 - 700}
        y={Y_Level_1 - 100}
        name={"T8"}
      />

      {/*---------------------------------- Level 0 -------------------------------------------------------*/}

      <g transform={`translate(${X_Normal_ER_West + 1600}, ${Y_Level_1})`}>
        <line
          x1={0}
          y1={330}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <g transform={`translate(${X_Normal_ER_West - 150}, ${Y_Level_1})`}>
        <line
          x1={0}
          y1={330}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <Arrow_line
        x1={X_Normal_ER_West - 150}
        y1={Y_Level_1 + 20}
        x2={X_Normal_ER_West + 1600}
        y2={Y_Level_1 + 20}
        label="NORMAL ELECTRICAL ROOM"
      />

      <g transform={`translate(${X_Normal_ER_West + 2100}, ${Y_Level_1})`}>
        <line
          x1={0}
          y1={330}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <g transform={`translate(${X_Normal_ER_West + 2700}, ${Y_Level_1})`}>
        <line
          x1={0}
          y1={330}
          x2={0}
          y2={0}
          stroke="#555"
          strokeWidth={8}
          strokeDasharray="10,5"
        />
      </g>
      <Arrow_line
        x1={X_Normal_ER_West + 2100}
        y1={Y_Level_1 + 20}
        x2={X_Normal_ER_West + 2700}
        y2={Y_Level_1 + 20}
        label="15KV Switchgear ROOM"
      />
      <PanelboardGroup
        devices={deviceMap}
        panelboards={fixedPanelList_Level_0}
      />
      <Transformer
        x={X_PanelGroup_Level0 - 1850}
        y={Y_Level_0 - 100}
        name={"T4"}
      />
      <Transformer
        x={X_PanelGroup_Level0 - 1450}
        y={Y_Level_0 - 100}
        name={"T4"}
      />
      <Transformer
        x={X_PanelGroup_Level0 - 1050}
        y={Y_Level_0 - 100}
        name={"T9"}
      />
      <Transformer
        x={X_PanelGroup_Level0 - 850}
        y={Y_Level_0 - 100}
        name={"T9"}
      />
      <Transformer
        x={X_PanelGroup_Level0 - 550}
        y={Y_Level_0 - 100}
        name={"T8"}
      />
    </>
  );
}

export default React.memo(LSB_Normal_Raiser);
