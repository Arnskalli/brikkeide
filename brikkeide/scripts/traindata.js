export const getStations = {
    "data": {
        "0": [200, 500],
        "1": [700, 400],
        "2": [750, 200],
        "3": [200, 200]
    }
};

export const getCrossings = {
    "data": {
        "0": [400, 550],
        "1": [400, 450],
        "2": [700, 350],
        "3": [600, 150],
        "4": [300, 100],
        "5": [300, 300]
    }
};

export const getLines = {
    "data": {
        "10": [1, 1, 0],
        "12": [1, 2, 2],
        "21": [2, 2, 1],
        "23": [2, 3, 4, 3],
        "30": [3, 5, 0],
        "32": [3, 5, 2],
        "01": [0, 0, 1],
        "03": [0, 5, 3]
    }
};

export const getTrainstat = {
    "data": [
        {
            "trainid": 1,
            "syklus": 1,
            "retning": 1,
            "sindex": 0,
            "lindex": 0,
            "line": "23",
            "avgang": 4,
            "stille": 1,
            "stations": [2, 3, 0, 3]
        },
        {
            "trainid": 0,
            "syklus": 1,
            "retning": 1,
            "sindex": 0,
            "lindex": 0,
            "line": "01",
            "avgang": 2,
            "stille": 1,
            "stations": [0, 1, 2, 3, 2, 1]
        }
    ]
};
