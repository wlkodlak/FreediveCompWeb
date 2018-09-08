import GenerateUuid from './GenerateUuid';

class MockedApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getGlobalSearch() {
    return Promise.resolve([
      {
        "RaceId": "fedf1d4e-9c97-496a-96b0-673a0d830918",
        "Name": "MČR 2018",
        "Start": "2018-05-26T00:00:00+02:00",
        "End": "2018-05-28T00:00:00+02:00"
      }
    ]);
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
        "Start": "2018-05-26T00:00:00+02:00",
        "End": "2018-05-28T00:00:00+02:00"
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
          "Rules": "AIDA_STA",
          "AnnouncementsClosed": false,
          "Sex": "Male"
        },
        {
          "DisciplineId": "STA-F",
          "ShortName": "STA",
          "LongName": "Static apnea - Women",
          "Rules": "AIDA_STA",
          "AnnouncementsClosed": false,
          "Sex": "Female"
        },
        {
          "DisciplineId": "DYN-M",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA_DYN",
          "AnnouncementsClosed": false,
          "Sex": "Male"
        },
        {
          "DisciplineId": "DYN-F",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA_DYN",
          "AnnouncementsClosed": false,
          "Sex": "Female"
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

  getAuthVerify(raceId) {
    return Promise.resolve({
      "JudgeId": "admin",
      "JudgeName": "Master Geralt",
      "DeviceIds": ["lkacldskiuleknmcalkjdf"]
    });
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

  postAuthAuthenticate(raceId, connectCode) {
    if (connectCode && connectCode.length > 0) {
      return Promise.resolve({
        "DeviceId": "1e8488e4-5a0e-4048-e8c4-99a8ceba2e01",
        "ConnectCode": "218637",
        "AuthenticationToken": "c13eaf476d5a468b76e5a4f6e84ac60547a8e7c6a54468lkjhvlk4a4cd654e",
        "JudgeId": "admin",
        "JudgeName": "Master Geralt"
      });
    } else {
      "DeviceId": "1e8488e4-5a0e-4048-e8c4-99a8ceba2e01",
      "ConnectCode": "218637"
    }
  }

  getReportStartingList(raceId, laneId) {
    return Promise.resolve({
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
            "Name": "STA",
            "Rules": "AIDA_STA"
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
            "Name": "STA",
            "Rules": "AIDA_STA"
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
            "Name": "STA",
            "Rules": "AIDA_STA"
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
    });
  }

  getReportDisciplineResults(raceId, disciplineId) {
    return Promise.resolve({
      "Metadata": {
        "DisciplineId": "DYN-M",
        "Title": "Dynamic apnea - Men",
        "Columns": [
          {
            "Discipline": {
              "DisciplineId": "DYN-M",
              "Name": "DYN",
              "Rules": "AIDA_DYN"
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
    });
  }

  getReportResultList(raceId, resultListId) {
    return Promise.resolve({
      "Metadata": {
        "ResultsListId": "Men",
        "Title": "Final results - Men",
        "Columns": [
          {
            "Discipline": {
              "DisciplineId": "STA-M",
              "Name": "STA",
              "Rules": "AIDA_STA"
            },
            "Title": "STA",
            "IsSortingSource": false
          },
          {
            "Discipline": {
              "DisciplineId": "DYN-M",
              "Name": "DYN",
              "Rules": "AIDA_DYN"
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
    });
  }

  getAthletes(raceId) {
    return Promise.resolve([
      {
        "Profile": {
          "AthleteId": "73-mateusz-malina",
          "FirstName": "Mateusz",
          "Surname": "Malina",
          "CountryName": "POL",
          "Sex": "Male"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-M",
            "Performance": {
              "Duration": "00:00:01"
            }
          }
        ]
      },
      {
        "Profile": {
          "AthleteId": "19-milan-wilczak",
          "FirstName": "Milan",
          "Surname": "Wilczak",
          "CountryName": "CZE",
          "Sex": "Male",
          "Club": "Ocean Devils"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-M",
            "Performance": {
              "Duration": "00:05:00"
            }
          }
        ]
      },
      {
        "Profile": {
          "AthleteId": "23-radek-svoboda",
          "FirstName": "Radek",
          "Surname": "Svoboda",
          "CountryName": "CZE",
          "Sex": "Male"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-M",
            "Performance": {
              "Duration": "00:01:00"
            }
          }
        ]
      },
      {
        "Profile": {
          "AthleteId": "61-radim-darous",
          "FirstName": "Radim",
          "Surname": "Darous",
          "CountryName": "CZE",
          "Sex": "Male"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-M",
            "Performance": {
              "Duration": "00:02:00"
            }
          }
        ]
      },
      {
        "Profile": {
          "AthleteId": "27-martina-silhava",
          "FirstName": "Martina",
          "Surname": "Silhava",
          "CountryName": "CZE",
          "Sex": "Female"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-F",
            "Performance": {
              "Duration": "00:01:00"
            }
          }
        ]
      },
      {
        "Profile": {
          "AthleteId": "44-jana-mala",
          "FirstName": "Jana",
          "Surname": "Mala",
          "CountryName": "CZE",
          "Sex": "Female"
        },
        "Announcements": [
          {
            "DisciplineId": "STA-F",
            "Performance": {
              "Duration": "00:00:05"
            }
          }
        ]
      }
    ]);
  }

  getAthlete(raceId, athleteId) {
    return Promise.resolve({
      "Profile": {
        "AthleteId": "19-milan-wilczak",
        "FirstName": "Milan",
        "Surname": "Wilczak",
        "CountryName": "CZE",
        "Sex": "Male",
        "Club": "Ocean Devils"
      },
      "Announcements": [
        {
          "DisciplineId": "STA-M",
          "Performance": {
            "Duration": "00:05:00"
          }
        },
        {
          "DisciplineId": "DYN-M",
          "Performance": {
            "Distance": 100
          }
        }
      ],
      "Results": [
        {
          "DisciplineId": "STA-M",
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
        },
        {
          "DisciplineId": "DYN-M",
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
      ]
    });
  }

  postAthlete(raceId, athleteId, athleteData) {
    console.log("postAthlete(" + raceId + ", " + athleteId + ")");
    console.log(athleteData);
    return Promise.resolve(null);
  }

  postAthleteResult(raceId, athleteId, result) {
    console.log("postAthleteResult(" + raceId + ", " + athleteId + ")");
    console.log(result);
    return Promise.resolve(null);
  }

  postStartingList(raceId, startingLaneId, entries) {
    console.log("postStartingList(" + raceId + ", " + startingLaneId + ")");
    console.log(entries);
    return Promise.resolve(null);
  }

  getNewRaceId() {
    return GenerateUuid();
  }
}

export default MockedApi;
