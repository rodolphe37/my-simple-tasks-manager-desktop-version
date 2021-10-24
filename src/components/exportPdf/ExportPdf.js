import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import useCutDecimals from "../../hooks/useCutDecimals";
import useReverseArray from "../../hooks/useReverseArray";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#000000",
    width: 250,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  movieContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  movieDetails: {
    display: "flex",
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    border: "1px solid",
    borderColor: " #000",
    color: "darkred",
    width: 250,
  },
  titleCard: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    border: "1px solid",
    borderColor: " #000",
    color: "darkred",
    width: 170,
  },
  movieOverview: {
    fontSize: 10,
  },

  image: {
    height: 200,
    width: 250,
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 170,
    alignItems: "center",
    marginBottom: 12,
  },
  overviewContainer: {
    minHeight: 110,
  },
  detailsFooter: {
    display: "flex",
    flexDirection: "row",
  },
  flex: {
    width: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexStart: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
    width: 550,
    flexWrap: "wrap",
  },
  stickyNotes: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
    width: 100,
    border: "1px solid #000 !important",
  },
  stickyNotesLast: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
    width: 100,
    border: "1px solid #000 !important",
    marginBottom: 25,
  },
  marginBottom: {
    marginBottom: 22,
    marginRight: 12,
    fontSize: 13,
  },
  marginText: {
    marginLeft: 25,
  },
  largeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    border: "1px solid",
    borderColor: " #000",
    color: "darkred",
    width: 500,
  },
});

export function PdfDocument(props) {
  const { cutDecimals } = useCutDecimals();
  const { mapRevers } = useReverseArray();
  const {
    data,
    totalTimeSeconds,
    totalTimeLocalStore,
    tjm,
    changeEurDoll,
    stockItemsByStatus,
    taskPerHour,
    // cumuledTimeCards,
    Note1Content,
    Note2Content,
    Note3Content,
    Note4Content,
    connexionNumber,
    completCardsTimeArray,
  } = props;
  const projectName = localStorage.getItem("projectName");
  const totalEuro = tjm * changeEurDoll;

  const EuroTjm = cutDecimals(totalTimeLocalStore / 3600, 2);
  const TimePricePerHour = cutDecimals(tjm / 8, 2);
  const TimePriceEuroPerHour = cutDecimals((tjm / 8) * changeEurDoll, 2);
  const totalDaysWork = cutDecimals(totalTimeLocalStore / 28800, 2);
  const totalSumByCumuledDays = cutDecimals(
    (tjm * totalTimeLocalStore) / 28800,
    2
  );
  const totalSumTimeByDayWork = cutDecimals(
    ((tjm * totalTimeLocalStore) / 28800) * changeEurDoll,
    2
  );
  const Tasks = stockItemsByStatus["Done"].length;
  const TasksByHour = cutDecimals(totalTimeLocalStore / 3600 / taskPerHour, 2);
  const workingConnexion = cutDecimals(
    connexionNumber / stockItemsByStatus["Done"].length,
    0
  );

  const NewDateCreated = (number) => {
    const NewDate = new Date(number * 1000).toISOString().substr(11, 8);
    return NewDate;
  };

  // console.log(
  //   "pdf props",
  //   data.filter((res) => res.start !== "")
  // );
  // console.log("time props", totalTimeLocalStore);
  // console.log("tjm props", tjm);
  // console.log("changeEurDoll props", changeEurDoll);
  // console.log("stockItemsByStatus props", stockItemsByStatus);
  // console.log("tasksNumber props", taskPerHour);
  // console.log("cumuledTimeCards props", cumuledTimeCards);
  // console.log("Note1Content props", Note1Content);
  // console.log("Note2Content props", Note2Content);
  // console.log("Note3Content props", Note3Content);
  // console.log("Note4Content props", Note4Content);
  // console.log("connexionNumber props", connexionNumber);
  // console.log(
  //   "totalTimeSeconds props",
  //   totalTimeSeconds.filter((result) => !isNaN(result.total))
  // );
  // console.log(
  //   "completCardsTimeArray props",
  //   completCardsTimeArray.filter((resu) => resu.start !== "")
  // );

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.movieContainer}>
          <View style={styles.movieDetails}>
            <Text style={{ marginLeft: 350, fontWeight: "bold" }}>
              {projectName}
            </Text>
            <View style={styles.overviewContainer}>
              <View className="priceContainer" style={styles.marginBottom}>
                <Text style={styles.title}>Your Daily Rate:</Text>
                <Text style={styles.marginText}>In Dollars : ${tjm}</Text>
                <Text style={styles.marginText}>In Euros : {totalEuro}€</Text>
              </View>
              <View style={styles.flexStart}>
                <View style={styles.marginBottom}>
                  <Text style={styles.titleCard}>Your Total Time :</Text>
                  <Text style={styles.marginText}>
                    In Hours : {EuroTjm} days
                  </Text>
                  <Text style={styles.marginText}>
                    ${TimePricePerHour} per hour
                  </Text>
                  <Text style={styles.marginText}>
                    €{TimePriceEuroPerHour} per hour
                  </Text>
                </View>
                <View style={styles.marginBottom}>
                  <Text style={styles.titleCard}>Total Days worked:</Text>
                  <Text style={styles.marginText}>{totalDaysWork} days</Text>
                  <Text style={styles.marginText}>
                    ${totalSumByCumuledDays} total
                  </Text>
                  <Text style={styles.marginText}>
                    €{totalSumTimeByDayWork} total
                  </Text>
                </View>
                <View style={styles.marginBottom}>
                  <Text style={styles.titleCard}>Number Tasks:</Text>
                  <Text style={styles.marginText}>{Tasks} tasks</Text>
                  <Text style={styles.marginText}>{TasksByHour} hour/task</Text>
                </View>
              </View>

              <Text style={styles.title}>Sticky note's</Text>
              <View style={styles.flexStart}>
                <View style={styles.marginBottom}>
                  <View style={styles.stickyNotes}>
                    <Text>Sticky note1:</Text>
                    <Text>{Note1Content}</Text>
                  </View>
                </View>
                <View style={styles.marginBottom}>
                  <View style={styles.stickyNotes}>
                    <Text>Sticky note2:</Text>
                    <Text>{Note2Content}</Text>
                  </View>
                </View>
                <View style={styles.marginBottom}>
                  <View style={styles.stickyNotes}>
                    <Text>Sticky note3:</Text>
                    <Text>{Note3Content}</Text>
                  </View>
                </View>
                <View style={styles.marginBottom}>
                  <View style={styles.stickyNotes}>
                    <Text>Sticky note4:</Text>
                    <Text>{Note4Content}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.marginBottom}>
                <Text style={styles.title}>Number working connexion:</Text>
                {isNaN(connexionNumber) === false ? (
                  <Text style={{ marginBottom: 12 }}>
                    Working connexion: {workingConnexion}
                  </Text>
                ) : null}
              </View>
              <View style={{ marginBottom: 70 }}>
                {stockItemsByStatus && (
                  <View>
                    <Text style={styles.title}>Tasks Done</Text>
                    <View style={styles.flexStart}>
                      {stockItemsByStatus["Done"].length > 0 ? (
                        stockItemsByStatus["Done"].map((res, i) => (
                          <View style={styles.stickyNotes} key={i}>
                            <View style={{ fontSize: 14, marginBottom: 22 }}>
                              <Text style={{ marginBottom: 8 }}>
                                {res.title}{" "}
                              </Text>
                              <Text style={{ fontSize: 10, marginBottom: 5 }}>
                                {res.id}{" "}
                              </Text>
                              <Text>{res.description} </Text>
                              <View>
                                <Text style={{ fontSize: 11 }}>
                                  Created:{" "}
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      color: "blue",
                                      marginBottom: 11,
                                    }}
                                  >
                                    {res.timestamp}
                                  </Text>
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={{ color: "darkred", fontWeight: "bold" }}>
                          No tasks in this section
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {totalTimeSeconds.filter((totMax) => totMax.total >= 7200) ? (
                  <View style={{ marginTop: 40 }}>
                    <Text style={styles.largeTitle}>
                      Working session that required more than 2 hours
                    </Text>
                    <View style={styles.flexStart}>
                      {data !== [] ? (
                        totalTimeSeconds &&
                        totalTimeSeconds
                          .filter((totMax) => totMax.total >= 7200)
                          .map((res, i) => (
                            <View style={styles.stickyNotes} key={i}>
                              {isNaN(res.total) === false ? (
                                <View
                                  style={{ fontSize: 14, marginBottom: 22 }}
                                >
                                  <Text style={{ marginBottom: 8 }}>
                                    {res.title}
                                  </Text>

                                  <Text style={{ fontSize: 10 }}>{res.id}</Text>

                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        color: "#57a957",
                                        marginBottom: 11,
                                      }}
                                    >
                                      {NewDateCreated(res.total)}{" "}
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          fontStyle: "italic",
                                          color: "#000",
                                        }}
                                      >
                                        hour(s)
                                      </Text>
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                            </View>
                          ))
                      ) : (
                        <Text>No Working session in this section</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  ""
                )}
                {totalTimeSeconds.filter(
                  (totMax) => totMax.total >= 3600 && totMax.total < 7200
                ) ? (
                  <View style={{ marginTop: 40 }}>
                    <Text style={styles.largeTitle}>
                      Working session that required between 1 and 2 hour(s)
                    </Text>
                    <View style={styles.flexStart}>
                      {data !== [] ? (
                        totalTimeSeconds &&
                        totalTimeSeconds
                          .filter(
                            (totMax) =>
                              totMax.total >= 3600 && totMax.total < 7200
                          )
                          .map((res, i) => (
                            <View style={styles.stickyNotes} key={i}>
                              {isNaN(res.total) === false ? (
                                <View
                                  style={{ fontSize: 14, marginBottom: 22 }}
                                >
                                  <Text style={{ marginBottom: 8 }}>
                                    {res.title}
                                  </Text>

                                  <Text style={{ fontSize: 10 }}>{res.id}</Text>

                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        color: "#57a957",
                                        marginBottom: 11,
                                      }}
                                    >
                                      {NewDateCreated(res.total)}
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          fontStyle: "italic",
                                          color: "#000",
                                        }}
                                      >
                                        hour(s)
                                      </Text>
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                            </View>
                          ))
                      ) : (
                        <Text>No Working session in this section</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  ""
                )}
                <View style={{ marginTop: 40, marginBottom: 40 }}>
                  <Text style={styles.largeTitle}>
                    Working session that required less than 1 hour
                  </Text>
                  <View style={styles.flexStart}>
                    {data !== [] ? (
                      totalTimeSeconds &&
                      totalTimeSeconds
                        .filter((totMax) => totMax.total > 0)
                        .filter((totMax) => totMax.total < 3600)
                        .map((res, i) => (
                          <View style={styles.stickyNotes} key={i}>
                            {isNaN(res.total) === false ? (
                              <View style={{ fontSize: 14, marginBottom: 22 }}>
                                <Text style={{ marginBottom: 8 }}>
                                  {res.title}
                                </Text>

                                <Text style={{ fontSize: 10 }}>{res.id}</Text>

                                <View>
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      color: "#57a957",
                                      marginBottom: 11,
                                    }}
                                  >
                                    {NewDateCreated(res.total)}{" "}
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontStyle: "italic",
                                        color: "#000",
                                      }}
                                    >
                                      hour(s)
                                    </Text>
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        ))
                    ) : (
                      <Text>No Working session in this section</Text>
                    )}
                  </View>
                </View>
                <View>
                  <View>
                    <Text style={styles.title}>Time Elapsed For each Task</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "darkblue",
                        marginBottom: 10,
                      }}
                    >
                      (from the most recent session to the oldest)
                    </Text>
                  </View>
                  <View style={styles.flexStart}>
                    {mapRevers(completCardsTimeArray)
                      .filter((resFiltered) => resFiltered.start !== "")
                      .map((res, i) => (
                        <View style={styles.stickyNotesLast} key={i}>
                          <Text style={{ fontSize: 14 }}>{res.cardTitle}</Text>

                          <View style={{ fontSize: 11, textAlign: "center" }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#57a957",
                                marginBottom: 12,
                              }}
                            >
                              <Text style={{ color: "#000", fontSize: 10 }}>
                                {" "}
                                Start:
                              </Text>{" "}
                              {res.start}
                            </Text>
                          </View>
                          <View style={{ fontSize: 11, textAlign: "center" }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#ca3535",
                              }}
                            >
                              <Text style={{ color: "#000", fontSize: 10 }}>
                                Stop:
                              </Text>{" "}
                              {res.stop}
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.detailsFooter}>
              <View style={styles.marginBottom}>
                <Text style={{ textAlign: "center" }}>
                  Copyright - 2021 © Created with React by{" "}
                  <Text style={{ color: "rgb(121 204 82)" }}>
                    rodolphe Augusto
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
