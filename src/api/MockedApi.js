class MockedApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  postRaceSetup(raceId, raceSetup) {
    console.log("postRaceSetup(" + raceId + ")");
    console.log(raceSetup);
    return Promise.resolve(null);
  }

  getRaceSetup(raceId) {
    return Promise.resolve({
      "Race": {
        "RaceId": raceId,
        "Name": "MČR 2018",
        "Start": "2018-05-26",
        "End": "2018-05-28"
      },
      "StartingLanes": [
        {
          "StartingLaneId": "STA",
          "ShortName": "STA",
          "SubLanes": [
            {
              "StartingLaneId": "STA-A",
              "ShortName": "A"
            },
            {
              "StartingLaneId": "STA-B",
              "ShortName": "B"
            },
            {
              "StartingLaneId": "STA-C",
              "ShortName": "C"
            },
            {
              "StartingLaneId": "STA-D",
              "ShortName": "D"
            }
          ]
        },
        {
          "StartingLaneId": "DYN",
          "ShortName": "DYN",
          "SubLanes": [
            {
              "StartingLaneId": "DYN-A",
              "ShortName": "A"
            },
            {
              "StartingLaneId": "DYN-B",
              "ShortName": "B"
            }
          ]
        }
      ],
      "Disciplines": [
        {
          "DisciplineId": "STA-M",
          "ShortName": "STA",
          "LongName": "Static apnea - Men",
          "Rules": "AIDA-STA",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "STA-F",
          "ShortName": "STA",
          "LongName": "Static apnea - Women",
          "Rules": "AIDA-STA",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "DYN-M",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA-DYN",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "DYN-F",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA-DYN",
          "AnnouncementsClosed": false
        }
      ],
      "ResultsLists": [
        {
          "ResultsListId": "Men",
          "Title": "Final Results - Men",
          "Columns": [
            {
              "Title": "STA",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "STA-M"
                }
              ]
            },
            {
              "Title": "DYN",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "DYN-M"
                }
              ]
            },
            {
              "Title": "Total",
              "IsFinal": true,
              "Components": [
                {
                  "DisciplineId": "STA-M"
                },
                {
                  "DisciplineId": "DYN-M"
                }
              ]
            }
          ]
        },
        {
          "ResultsListId": "Women",
          "Title": "Final Results - Women",
          "Columns": [
            {
              "Title": "STA",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "STA-F"
                }
              ]
            },
            {
              "Title": "DYN",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "DYN-F"
                }
              ]
            },
            {
              "Title": "Total",
              "IsFinal": true,
              "Components": [
                {
                  "DisciplineId": "STA-F"
                },
                {
                  "DisciplineId": "DYN-F"
                }
              ]
            }
          ]
        }
      ]
    });
  }

  getAuthJudges(raceId) {
    return Promise.resolve([
      {
        "JudgeId": "admin",
        "JudgeName": "Master Geralt",
        "DeviceIds": ["lkacldskiuleknmcalkjdf"]
      },
      {
        "JudgeId": "milan",
        "JudgeName": "Milan Wilczak",
        "DeviceIds": ["983fkljh34k3ijnkjcbkh", "n4378cnbas65kjdkjhbcyde"]
      }
    ]);
  }

  postAuthAuthorize(raceId, authorizeRequest) {
    console.log("postAuthAuthorize(" + raceId + ")");
    console.log(authorizeRequest);
    return Promise.resolve({
      "JudgeId": authorizeRequest["JudgeId"],
      "JudgeName": authorizeRequest["JudgeName"],
      "DeviceIds": ["tesjckiyekj48wncu4"]
    });

  }

  getReportStartingList(raceId, laneId) {
    return {
      "Title": "STA",
      "Entries": [
        {
          "Athlete": {
            "AthleteId": "12-radim-pravy",
            "FirstName": "Radim",
            "Surname": "Pravy",
            "CountryName": "CZE",
            "Sex": "Male"
          },
          "Discipline": {
            "DisciplineId": "STA-M",
            "Name": "STA"
          },
          "Announcement": {
            "Performance": {
              "Duration": "00:02:00"
            }
          },
          "Start": {
            "StartingLaneId": "STA-B",
            "StartingLaneLongName": "B",
            "OfficialTop": "2018-05-27T09:44:00+02:00"
          }
        },
        {
          "Athlete": {
            "AthleteId": "19-milan-wilczak",
            "FirstName": "Milan",
            "Surname": "Wilczak",
            "CountryName": "CZE",
            "Sex": "Male"
          },
          "Discipline": {
            "DisciplineId": "STA-M",
            "Name": "STA"
          },
          "Announcement": {
            "Performance": {
              "Duration": "00:05:00"
            }
          },
          "Start": {
            "StartingLaneId": "STA-A",
            "StartingLaneLongName": "A",
            "OfficialTop": "2018-05-27T10:52:00+02:00"
          },
          "CurrentResult": {
            "Performance": {
              "Duration": "00:06:47",
              "Points": 81.4
            },
            "Penalizations": [],
            "FinalPerformance": {
              "Duration": "00:06:47",
              "Points": 81.4
            },
            "CardResult": "White",
            "JudgeId": "admin",
            "JudgeName": "Master Geralt"
          }
        },
        {
          "Athlete": {
            "AthleteId": "28-jana-novakova",
            "FirstName": "Jana",
            "Surname": "Novakova",
            "CountryName": "CZE",
            "Sex": "Female"
          },
          "Discipline": {
            "DisciplineId": "STA-F",
            "Name": "STA"
          },
          "Announcement": {
            "Performance": {
              "Duration": "00:03:00"
            }
          },
          "Start": {
            "StartingLaneId": "STA-B",
            "StartingLaneLongName": "B",
            "OfficialTop": "2018-05-27T11:04:00+02:00"
          },
          "CurrentResult": {
            "Performance": {
              "Duration": "00:04:55",
              "Points": 57.4
            },
            "Penalizations": [
              {
                "Reason": "Blackout",
                "ShortReason": "BO",
                "PenalizationId": "BO",
                "IsShortPerformance": false
              }
            ],
            "FinalPerformance": {
              "Duration": "00:04:55",
              "Points": 0
            },
            "CardResult": "Red",
            "JudgeId": "admin",
            "JudgeName": "Master Geralt",
            "JudgeNote": "BO"
          }
        }
      ]
    };
  }

  getReportDisciplineResults(raceId, disciplineId) {
    return {
      "Metadata": {
        "DisciplineId": "DYN-M",
        "Title": "Dynamic apnea - Men",
        "Columns": [
          {
            "Discipline": {
              "DisciplineId": "DYN-M",
              "Name": "DYN"
            },
            "Title": "DYN",
            "IsSortingSource": true
          }
        ]
      },
      "Results": [
        {
          "Athlete": {
            "AthleteId": "73-mateusz-malina",
            "FirstName": "Mateusz",
            "Surname": "Malina",
            "CountryName": "POL",
            "Sex": "Male"
          },
          "Subresults": [
            {
              "Announcement": {
                "Performance": {
                  "Distance": 150
                }
              },
              "CurrentResult": {
                "Performance": {
                  "Distance": 270,
                  "Points": 135
                },
                "Penalizations": [],
                "FinalPerformance": {
                  "Distance": 270,
                  "Points": 135
                },
                "CardResult": "White",
                "JudgeId": "admin",
                "JudgeName": "Master Geralt"
              }
            }
          ]
        },
        {
          "Athlete": {
            "AthleteId": "19-milan-wilczak",
            "FirstName": "Milan",
            "Surname": "Wilczak",
            "CountryName": "CZE",
            "Sex": "Male"
          },
          "Subresults": [
            {
              "Announcement": {
                "Performance": {
                  "Distance": 100
                }
              },
              "CurrentResult": {
                "Performance": {
                  "Distance": 125,
                  "Points": 62.5
                },
                "Penalizations": [],
                "FinalPerformance": {
                  "Distance": 125,
                  "Points": 62.5
                },
                "CardResult": "White",
                "JudgeId": "admin",
                "JudgeName": "Master Geralt"
              }
            }
          ]
        },
        {
          "Athlete": {
            "AthleteId": "23-radek-svoboda",
            "FirstName": "Radek",
            "Surname": "Svoboda",
            "CountryName": "CZE",
            "Sex": "Male"
          },
          "Subresults": [
            {
              "Announcement": {
                "Performance": {
                  "Distance": 100
                }
              },
              "CurrentResult": {
                "Performance": {
                  "Distance": 105,
                  "Points": 60.5
                },
                "Penalizations": [
                  {
                    "Reason": "Push/pull on exit",
                    "ShortReason": "Exit",
                    "PenalizationId": "ExitHelp",
                    "Performance": {
                      "Points": 5
                    },
                    "IsShortPerformance": false
                  }
                ],
                "FinalPerformance": {
                  "Distance": 105,
                  "Points": 50.0
                },
                "CardResult": "Yellow",
                "JudgeId": "admin",
                "JudgeName": "Master Geralt",
                "JudgeComment": "Exit"
              }
            }
          ]
        },
        {
          "Athlete": {
            "AthleteId": "61-radim-darous",
            "FirstName": "Radim",
            "Surname": "Darous",
            "CountryName": "CZE",
            "Sex": "Male"
          },
          "Subresults": [
            {
              "Announcement": {
                "Performance": {
                  "Distance": 100
                }
              },
              "CurrentResult": {
                "Performance": {
                  "Distance": 120,
                  "Points": 60
                },
                "Penalizations": [
                  {
                    "Reason": "Blackout",
                    "ShortReason": "BO",
                    "PenalizationId": "Blackout",
                    "IsShortPerformance": false
                  }
                ],
                "FinalPerformance": {
                  "Distance": 120,
                  "Points": 0
                },
                "CardResult": "White",
                "JudgeId": "admin",
                "JudgeName": "Master Geralt",
                "JudgeComment": "BO"
              }
            }
          ]
        }
      ]
    };
  }

  getReportResultList(raceId, resultListId) {
    return {
      "Metadata": {
        "ResultsListId": "Men",
        "Title": "Final results - Men",
        "Columns": [
          {
            "Discipline": {
              "DisciplineId": "STA-M",
              "Name": "STA"
            },
            "Title": "STA",
            "IsSortingSource": false
          },
          {
            "Discipline": {
              "DisciplineId": "DYN-M",
              "Name": "DYN"
            },
            "Title": "DYN",
            "IsSortingSource": false
          },
          {
            "Title": "Totals",
            "IsSortingSource": true
          }
        ]
      },
      "Results": []
    };
  }
}

export default MockedApi;
