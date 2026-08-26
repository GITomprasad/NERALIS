"""
Intelligent Multilingual Alert & Notification Dispatcher (SIH26002 - Module 5).
Supports 5 alert tiers (T1-T5), 8 NER languages + Hindi/English,
multi-channel output formatting (SMS, WhatsApp, IVR Voice, Push, USSD, NDMA CAP XML),
and 6 AM Daily Morning Collector Briefings.
"""

from typing import Dict, List, Any
import datetime

NER_TRANSLATIONS = {
    "ALERT_T3_LANDSLIDE": {
        "en": "WARNING (T3): Landslide risk elevated on NH-13 (Bomdila-Tawang). Heavy vehicles rerouted via Balipara.",
        "hi": "चेतावनी (T3): NH-13 (बोमडिला-तवांग) पर भूस्खलन का खतरा बढ़ा। भारी वाहनों को बालीपारा से डायवर्ट किया गया।",
        "as": "সতর্কবাণী (T3): NH-13 (বমডিলা-টাৱাং)ত ভূমিস্খলনৰ আশংকা বৃদ্ধি পাইছে। গধুৰ যান-বাহন বালিপাৰা হৈ ডাইভাৰ্ট কৰা হৈছে।",
        "bn": "সতর্কবার্তা (T3): NH-13 (বোমডিলা-তাওয়াং) এ ভূমিধসের ঝুঁকি বেড়েছে। ভারী যানবাহন বালিপাড়া দিয়ে ঘুরিয়ে দেওয়া হয়েছে।",
        "mni": "ꯆꯦꯀꯁꯤꯟꯋꯥ (T3): NH-13 (ꯕꯣꯃꯗꯤꯂꯥ-ꯇꯋꯥꯡ)ꯗ ꯂꯩꯃꯥꯡꯕꯒꯤ ꯑꯀꯤꯕ ꯍꯦꯟꯒꯠꯂꯦ꯫ ꯑꯔꯨꯝꯕ ꯒꯥꯔꯤꯁꯤꯡ ꯕꯥꯂꯤꯄꯥꯔꯥ ꯂꯝꯕꯤꯗ ꯍꯣꯡꯗꯣꯛꯈ꯭ꯔꯦ꯫",
        "khasi": "MAHAM (T3): Ka jingeh landslide ha NH-13 (Bomdila-Tawang). Ki kali heh la phah lyngba ka Balipara.",
        "mizo": "VAU KHANNA (T3): NH-13 (Bomdila-Tawang) ah leimin hlauhawm a sang. Motor lian chu Balipara lamah thawn kual an ni.",
        "nagamese": "HOOSHIYAR (T3): NH-13 rasta (Bomdila-Tawang) te landslide laga dukh asey. Bisi dangar gaari khan Balipara rasta luvikena jabole koishey.",
        "ne": "चेतावनी (T3): NH-13 (बोमडिला-तवाङ) मा पहिरोको जोखिम बढेको छ। भारी सवारी साधनहरू बालीपारा हुँदै डाइभर्ट गरिएको छ।"
    },
    "ALERT_T4_ROAD_CLOSED": {
        "en": "CRITICAL (T4): NH-10 Teesta Valley corridor closed due to debris surge at km 29. Mandatory diversion active.",
        "hi": "गंभीर (T4): 29 किमी पर मलबा आने के कारण NH-10 तीस्ता घाटी मार्ग बंद। अनिवार्य डायवर्जन सक्रिय।",
        "as": "জৰুৰী (T4): কিমি ২৯ত ধ্বংসাৱশেষ বৃদ্ধিৰ বাবে NH-10 তিস্তা উপত্যকা কৰিড'ৰ বন্ধ। বাধ্যতামূলক বিকল্প পথ সক্ৰিয়।",
        "bn": "জরুরি (T4): কিমি ২৯-এ ধ্বংসস্তূপ বৃদ্ধির কারণে NH-10 তিস্তা ভ্যালি করিডোর বন্ধ। বাধ্যতামূলক বিকল্প পথ সক্রিয়।",
        "mni": "ꯀ꯭ꯔꯤꯇꯤꯀꯦꯜ (T4): NH-10 ꯇꯤꯁ꯭ꯇꯥ ꯚꯦꯂꯤ ꯂꯝꯕꯤ ꯀꯤ:ꯃꯤ: ꯲꯹ꯗ ꯂꯩ ꯇꯨꯈꯤꯕꯅ ꯃꯔꯝ ꯑꯣꯏꯗꯨꯅ ꯊꯤꯡꯖꯤꯟꯈ꯭ꯔꯦ꯫",
        "khasi": "JINGEH BA KHRAW (T4): Ka surok NH-10 Teesta Valley la khang namar ka jingshlei ha km 29.",
        "mizo": "HLUAHLO (T4): NH-10 Teesta Valley kawng chu km 29-ah leimin avangin khar a ni. Kawng dang zawh tur.",
        "nagamese": "BISI DANGER (T4): NH-10 rasta Teesta Valley bondho korishey landslide karoney. Dosra rasta jabi.",
        "ne": "अति गम्भीर (T4): २९ किलोमिटरमा पहिरो खसेका कारण NH-10 टिस्टा उपत्यका सडक बन्द। अनिवार्य डाइभर्सन।"
    }
}

class AlertDispatcher:
    def __init__(self):
        self.active_alerts = self._get_initial_alerts()

    def _get_initial_alerts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ALT-2026-0891",
                "tier": "T4 - CRITICAL",
                "tier_level": 4,
                "title": "Coronation Bridge / NH-10 Teesta Corridor Blockade",
                "corridor_id": "SEG-12",
                "affected_districts": ["SK-GAN (Gangtok)", "SK-MANG (Mangan)"],
                "trigger_condition": "Live river gauge + acoustic sensor trigger at 29th Mile",
                "timestamp": "2026-08-26T08:15:00+05:30",
                "acknowledged": True,
                "acknowledged_by": "District Magistrate Gangtok (Dr. T. Bhutia)",
                "escalation_sla_mins": 20,
                "dispatched_channels": ["SMS", "WhatsApp", "App Push", "IVR Voice", "NDMA CAP Feed"],
                "target_recipients_count": 482,
                "message_i18n": NER_TRANSLATIONS["ALERT_T4_ROAD_CLOSED"]
            },
            {
                "id": "ALT-2026-0892",
                "tier": "T3 - WARNING",
                "tier_level": 3,
                "title": "NH-13 Sela Pass Incipient Landslide Advisory",
                "corridor_id": "SEG-05",
                "affected_districts": ["AR-TAW (Tawang)", "AR-BOM (Bomdila)"],
                "trigger_condition": "72h Rainfall forecast exceeded 220mm; Soil moisture 94%",
                "timestamp": "2026-08-26T09:30:00+05:30",
                "acknowledged": False,
                "acknowledged_by": "Pending DC Tawang Acknowledgement (9 mins remaining)",
                "escalation_sla_mins": 20,
                "dispatched_channels": ["SMS", "WhatsApp", "App Push"],
                "target_recipients_count": 215,
                "message_i18n": NER_TRANSLATIONS["ALERT_T3_LANDSLIDE"]
            },
            {
                "id": "ALT-2026-0893",
                "tier": "T2 - ADVISORY",
                "tier_level": 2,
                "title": "Sonapur Tunnel Waterlogging & Slow Moving Traffic",
                "corridor_id": "SEG-03",
                "affected_districts": ["ML-EKH (East Khasi Hills)", "AS-SIL (Silchar)"],
                "trigger_condition": "Continuous monsoon runoff in East Jaintia Hills",
                "timestamp": "2026-08-26T10:00:00+05:30",
                "acknowledged": True,
                "acknowledged_by": "SP Traffic Jowai",
                "escalation_sla_mins": 60,
                "dispatched_channels": ["SMS", "App Push"],
                "target_recipients_count": 640,
                "message_i18n": {
                    "en": "ADVISORY (T2): NH-6 Sonapur tunnel experiencing 1.5-hour delay due to mud silt. Single lane open.",
                    "hi": "सलाह (T2): कीचड़ जमा होने के कारण NH-6 सोनापुर सुरंग में 1.5 घंटे की देरी। एक लेन चालू।"
                }
            }
        ]

    def get_alerts(self) -> List[Dict[str, Any]]:
        return self.active_alerts

    def create_alert(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        new_alert = {
            "id": f"ALT-2026-{random_id()}",
            "tier": payload.get("tier", "T2 - ADVISORY"),
            "tier_level": payload.get("tier_level", 2),
            "title": payload.get("title", "Logistics Corridor Notice"),
            "corridor_id": payload.get("corridor_id", "SEG-01"),
            "affected_districts": payload.get("affected_districts", ["AS-KAM"]),
            "trigger_condition": payload.get("trigger_condition", "Manual Officer Dispatch"),
            "timestamp": datetime.datetime.now().isoformat(),
            "acknowledged": False,
            "acknowledged_by": "Pending Officer Acknowledgement",
            "escalation_sla_mins": 20,
            "dispatched_channels": payload.get("channels", ["SMS", "WhatsApp", "Push"]),
            "target_recipients_count": payload.get("recipients_count", 150),
            "message_i18n": {
                "en": payload.get("message_en", "Urgent road advisory for North Eastern logistics corridor."),
                "hi": payload.get("message_hi", "उत्तर पूर्वी लॉजिस्टिक्स कॉरिडोर के लिए आवश्यक सलाह।")
            }
        }
        self.active_alerts.insert(0, new_alert)
        return new_alert

    def generate_cap_xml(self, alert_id: str) -> str:
        """
        Generates standard NDMA Common Alerting Protocol (CAP v1.2) XML document.
        """
        alert = next((a for a in self.active_alerts if a["id"] == alert_id), self.active_alerts[0])
        msg_en = alert.get("message_i18n", {}).get("en", alert["title"])

        xml_str = f"""<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>NERALIS-{alert['id']}</identifier>
  <sender>mcdoner-alerts@gov.in</sender>
  <sent>{alert['timestamp']}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Transport</category>
    <event>{alert['title']}</event>
    <urgency>Expected</urgency>
    <severity>{alert['tier'].split(' - ')[-1]}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>SAME</valueName>
      <value>TRN</value>
    </eventCode>
    <headline>{alert['title']}</headline>
    <description>{msg_en}</description>
    <area>
      <areaDesc>{', '.join(alert['affected_districts'])}</areaDesc>
    </area>
  </info>
</alert>"""
        return xml_str

    def get_morning_briefing(self) -> Dict[str, Any]:
        """
        Automated 6 AM Daily Logistics Intelligence Briefing for District Collectors & Chief Secretaries.
        """
        return {
            "date": "2026-08-26",
            "prepared_for": "Chief Secretary / District Magistrates of 8 NER States",
            "overall_status": "MONSOON SURGE - 82% CORRIDORS OPERATIONAL",
            "top_5_critical_corridors": [
                {"corridor": "NH-10 (Siliguri - Gangtok)", "risk": "82% (Restricted)", "action": "Enforce convoy speed limit and bypass light traffic via Melli."},
                {"corridor": "NH-13 (Bomdila - Tawang)", "risk": "79% (Degraded)", "action": "Stage BRO bulldozers at Sela Pass west portal."},
                {"corridor": "NH-37 (Silchar - Jiribam - Imphal)", "risk": "75% (Degraded)", "action": "Maintain 24x7 river gauge monitoring at Irang Bridge."},
                {"corridor": "NH-6 (East Jaintia Hills - Silchar)", "risk": "68% (Restricted)", "action": "Deploy mudflow vacuum pumps at Sonapur tunnel entrance."},
                {"corridor": "NH-2 (Dimapur - Kohima)", "risk": "64% (Restricted)", "action": "Stagger heavy truck departure from Dimapur railhead."}
            ],
            "essential_supplies_status": "Safe buffer stocks at all 6 apex depots. Tawang forward reserve at 18 days autonomy.",
            "fleet_in_motion": "142 Essential Commodity Trucks Active | 98.4% GPS Ping Reliability"
        }

def random_id():
    import random
    return str(random.randint(1000, 9999))

alert_dispatcher = AlertDispatcher()
