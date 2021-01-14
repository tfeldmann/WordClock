import QtQml 2.15
import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Layouts 1.15

import "wordclock.js" as Wordclock

Window {
    visible: true
    width: 450
    height: 440
    color: "#000000"

    property var language: Qt.locale().name
    property var letters: Array(110).fill(0)
    property var corners: Array(4).fill(0)
    readonly property real rect_size: Math.min(width / 14, height / 13)

    Timer {
        interval: 500
        running: true
        repeat: true
        onTriggered: {
            let now = new Date()
            let m = now.getMinutes()
            let h = now.getHours() % 12
            letters = Wordclock.letters(h, m, language)
            corners = Wordclock.corners(m)
        }
    }

    Grid {
        rows: 10
        columns: 11
        anchors.centerIn: parent
        Repeater {
            model: Array.from(Wordclock.find_layout(language).letters)
            Rectangle {
                width: rect_size
                height: rect_size
                color: "#000000"
                Text {
                    text: modelData
                    font.pixelSize: rect_size * 0.7
                    anchors.centerIn: parent
                    color: {
                        let v = Math.max(letters[index], 0.05)
                        return Qt.rgba(v, v, v, 1)
                    }
                    Behavior on color {
                        ColorAnimation {
                            duration: 500
                        }
                    }
                }
            }
        }
    }
}
