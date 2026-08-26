"""
Intelligent Multilingual Alert & Notification Dispatcher (Module 5).
Supports 5 alert tiers (T1-T5), 8 NER languages + Hindi/English,
multi-channel output formatting (SMS, WhatsApp, IVR Voice, Push, USSD, NDMA CAP XML v1.2),
and 6 AM Daily Morning Collector Briefings.
"""

from typing import Dict, List, Any
import datetime
import random

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
                "message_i18n": NER_TRANSLATIONS["ALERT_T4_ROAD_CLOSED"],
                "source": "SRC-NDMA-CAP",
                "verification_status": "VERIFIED"
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
                "message_i18n": NER_TRANSLATIONS["ALERT_T3_LANDSLIDE"],
                "source": "SRC-IMD-AWS",
                "verification_status": "OBSERVED"
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
                },
                "source": "SRC-STATE-PWD",
                "verification_status": "VERIFIED"
            }
        ]

    def get_alerts(self) -> List[Dict[str, Any]]:
        return self.active_alerts

    def create_alert(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        new_alert = {
            "id": f"ALT-2026-{random.randint(1000, 9999)}",
            "tier": payload.get("tier", "T3 - WARNING"),
            "tier_level": payload.get("tier_level", 3),
            "title": payload.get("title", "Emergency Corridor Warning"),
            "corridor_id": payload.get("corridor_id", "SEG-01"),
            "affected_districts": payload.get("affected_districts", ["AS-KAM"]),
            "trigger_condition": payload.get("trigger_condition", "Automated Sensor Rule / Manual Broadcast"),
            "timestamp": datetime.datetime.now().isoformat(),
            "acknowledged": False,
            "acknowledged_by": "Pending Authority Acknowledgement",
            "escalation_sla_mins": 20,
            "dispatched_channels": payload.get("channels", ["SMS", "WhatsApp", "Push"]),
            "target_recipients_count": payload.get("recipients_count", 150),
            "message_i18n": {
                "en": payload.get("message_en", "Urgent Alert"),
                "hi": payload.get("message_hi", payload.get("message_en", "Urgent Alert"))
            },
            "source": "SRC-NDMA-CAP",
            "verification_status": "VERIFIED"
        }
        self.active_alerts.insert(0, new_alert)
        return new_alert

    def generate_cap_xml(self, alert_id: str) -> str:
        """
        Generates standard NDMA / ITU-T X.1303 compliant Common Alerting Protocol (CAP v1.2) XML.
        """
        alert = next((a for a in self.active_alerts if a["id"] == alert_id), self.active_alerts[0])
        now_utc = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        
        xml_template = f"""<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>NERALIS-NDMA-{alert['id']}</identifier>
  <sender>neralis.disaster.ops@gov.in</sender>
  <sent>{now_utc}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Transport</category>
    <event>{alert['title']}</event>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>NDMA_CODE</valueName>
      <value>TRANS_DISRUPT_T{alert['tier_level']}</value>
    </eventCode>
    <headline>{alert['title']}</headline>
    <description>{alert['message_i18n'].get('en', 'Emergency transport disruption')}</description>
    <area>
      <areaDesc>{", ".join(alert['affected_districts'])}</areaDesc>
      <polygon>26.72,88.39 27.58,91.85 27.33,88.60 26.72,88.39</polygon>
    </area>
  </info>
</alert>"""
        return xml_template

    def get_morning_briefing(self) -> Dict[str, Any]:
        """
        Daily 6 AM Executive Collector Briefing summary for all 8 NER states.
        """
        return {
            "briefing_id": f"NERALIS-BRF-{datetime.datetime.now().strftime('%Y%m%d')}",
            "generated_at": datetime.datetime.now().strftime("%Y-%m-%d 06:00:00 IST"),
            "region": "North Eastern Region (8 States)",
            "overall_logistics_status": "YELLOW ADVISORY (Monsoon Season Surge)",
            "critical_blockades_count": 2,
            "restricted_corridors_count": 5,
            "key_alerts": [
                "NH-10 Teesta Corridor: Total Blockade km 29. Use Sevoke-Melli-Jorethang bypass.",
                "NH-13 Sela Pass: Incipient mudflow warning. 4WD light vehicles only.",
                "NH-6 Sonapur Tunnel: 1.5-hour delay siltation. Single convoy active."
            ],
            "depot_stock_status": {
                "guwahati_hub_pct": 87,
                "tawang_forward_buffer_pct": 52,
                "mangan_buffer_pct": 41,
                "silchar_hub_pct": 81
            },
            "recommended_district_actions": [
                "DC Gangtok: Mobilize essential fuel supplies via Melli corridor.",
                "DC Tawang: Confirm 6-convoy medical prepositioning departure by 05:00 AM.",
                "DC Cachar: Ensure Barak river Ro-Ro barges on standby at Silchar Jetty."
            ]
        }

alert_dispatcher = AlertDispatcher()
