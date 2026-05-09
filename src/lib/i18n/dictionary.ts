import { defaultLanguage, type AppLanguage } from "@/lib/i18n/config";

type Dictionary = {
  languageName: string;
  languageLabel: string;
  nav: {
    dashboard: string;
    voiceUpload: string;
    analytics: string;
    notifications: string;
    agentDashboard: string;
    adminDashboard: string;
    settings: string;
    features: string;
    about: string;
    pricing: string;
    contact: string;
  };
  actions: {
    login: string;
    getStarted: string;
  };
  footer: {
    company: string;
    support: string;
    builtForSupport: string;
    productDescription: string;
  };
  pages: {
    features: {
      title: string;
      subtitle: string;
    };
    about: {
      title: string;
      paragraphs: [string, string, string];
    };
    pricing: {
      title: string;
      subtitle: string;
    };
    contact: {
      title: string;
      subtitle: string;
      fullName: string;
      workEmail: string;
      company: string;
      message: string;
      sendMessage: string;
      yourName: string;
      companyName: string;
      workflowGoalsPlaceholder: string;
    };
  };
  voice: {
    heading: string;
    subtitle: string;
    recordingPanelTitle: string;
    filePanelTitle: string;
    liveSpeechText: string;
    mediaEvidenceTitle: string;
    mediaEvidenceSubtitle: string;
    takePhoto: string;
    uploadFromDevice: string;
    uploadingMedia: string;
  };
};

const dictionaries: Record<AppLanguage, Dictionary> = {
  en: {
    languageName: "English",
    languageLabel: "Language",
    nav: {
      dashboard: "User Dashboard",
      voiceUpload: "Voice Upload",
      analytics: "Analytics",
      notifications: "Notifications",
      agentDashboard: "Agent Dashboard",
      adminDashboard: "Admin Dashboard",
      settings: "Settings",
      features: "Features",
      about: "About",
      pricing: "Pricing",
      contact: "Contact",
    },
    actions: {
      login: "Log in",
      getStarted: "Get Started",
    },
    footer: {
      company: "Company",
      support: "Support",
      builtForSupport: "Built for modern support operations.",
      productDescription:
        "Multilingual AI-powered voice-to-workflow automation for support operations.",
    },
    pages: {
      features: {
        title: "Feature Stack",
        subtitle:
          "Voice2Action provides a complete AI-powered workflow from voice complaint capture to ticket resolution analytics.",
      },
      about: {
        title: "Built for modern customer support teams",
        paragraphs: [
          "Voice2Action is a multilingual AI platform designed to transform unstructured voice complaints into structured support workflows.",
          "Our mission is to help support teams reduce response time, prioritize urgent issues accurately, and operate with data-driven clarity.",
          "The platform combines speech-to-text, language detection, sentiment analysis, urgency scoring, and ticket automation in a single production-ready system.",
        ],
      },
      pricing: {
        title: "Pricing plans for every growth stage",
        subtitle:
          "Start quickly and scale with multilingual voice intelligence, automated workflows, and advanced support analytics.",
      },
      contact: {
        title: "Talk with our team",
        subtitle:
          "Book a product walkthrough and see how Voice2Action can automate complaint handling for your support organization.",
        fullName: "Full name",
        workEmail: "Work email",
        company: "Company",
        message: "Message",
        sendMessage: "Send Message",
        yourName: "Your name",
        companyName: "Company name",
        workflowGoalsPlaceholder: "Tell us about your support workflow goals",
      },
    },
    voice: {
      heading: "Record or upload complaint audio",
      subtitle:
        "Submit multilingual complaint audio and preview waveform before sending it to the AI pipeline.",
      recordingPanelTitle: "Record in browser",
      filePanelTitle: "Upload audio file",
      liveSpeechText: "Live speech text",
      mediaEvidenceTitle: "Complaint media evidence",
      mediaEvidenceSubtitle: "Upload image/video proof or capture photo directly from camera.",
      takePhoto: "Take photo",
      uploadFromDevice: "Upload image or video",
      uploadingMedia: "Uploading media...",
    },
  },
  si: {
    languageName: "සිංහල",
    languageLabel: "භාෂාව",
    nav: {
      dashboard: "පරිශීලක පාලක පුවරුව",
      voiceUpload: "හඬ උඩුගත කිරීම",
      analytics: "විශ්ලේෂණ",
      notifications: "දැනුම්දීම්",
      agentDashboard: "නිලධාරී පුවරුව",
      adminDashboard: "පරිපාලක පුවරුව",
      settings: "සැකසුම්",
      features: "විශේෂාංග",
      about: "අප ගැන",
      pricing: "මිල ගණන්",
      contact: "සම්බන්ධ වන්න",
    },
    actions: {
      login: "පිවිසෙන්න",
      getStarted: "ආරම්භ කරන්න",
    },
    footer: {
      company: "සමාගම",
      support: "සහාය",
      builtForSupport: "නවීන සහාය මෙහෙයුම් සඳහා නිර්මාණය කර ඇත.",
      productDescription:
        "බහුභාෂා AI මඟින් හඬ ඇතුළත් කටයුතු ක්‍රියාවලිය ස්වයංක්‍රිය කිරීම සහාය මෙහෙයුම් සඳහා.",
    },
    pages: {
      features: {
        title: "විශේෂාංග සැලැස්ම",
        subtitle:
          "Voice2Action හඬ පැමිණිලි ලබාගැනීමේ සිට ටිකට් විසඳුම් විශ්ලේෂණය දක්වා සම්පූර්ණ AI ක්‍රියාවලියක් ලබාදෙයි.",
      },
      about: {
        title: "නවීන පාරිභෝගික සහාය කණ්ඩායම් සඳහා නිර්මාණය කරන ලද්දේ",
        paragraphs: [
          "Voice2Action යනු ව්‍යුහගත නොවන හඬ පැමිණිලි ව්‍යුහගත සහාය ක්‍රියාවලීන් බවට පරිවර්තනය කරන බහුභාෂා AI වේදිකාවකි.",
          "අපගේ මෙහෙවර වන්නේ සහාය කණ්ඩායම්ගේ ප්‍රතිචාර කාලය අඩු කිරීම, අත්‍යවශ්‍ය ගැටලු නිවැරදිව ප්‍රමුඛතාවයට පත් කිරීම, සහ දත්ත මත පදනම් වූ පැහැදිලිත්වයෙන් ක්‍රියා කිරීමට උපකාර කිරීමයි.",
          "මෙම වේදිකාව කථනය-පෙළට, භාෂා හඳුනාගැනීම, හැඟීම් විශ්ලේෂණය, හදිසිත්ව ලකුණු කිරීම සහ ටිකට් ස්වයංක්‍රීයකරණය එකම නිෂ්පාදන-සූදානම් පද්ධතියකට එක් කරයි.",
        ],
      },
      pricing: {
        title: "වර්ධන අදියර සෑම එකකටම මිල සැලසුම්",
        subtitle:
          "බහුභාෂා හඬ බුද්ධිය, ස්වයංක්‍රීය ක්‍රියාවලි, සහ උසස් සහාය විශ්ලේෂණ සමඟ ඉක්මනින් ආරම්භ කර ඉහළට වර්ධනය වන්න.",
      },
      contact: {
        title: "අපගේ කණ්ඩායම සමඟ කතා කරන්න",
        subtitle:
          "නිෂ්පාදන දර්ශනයක් වෙන්කර Voice2Action ඔබගේ සහාය ආයතනයේ පැමිණිලි කළමනාකරණය ස්වයංක්‍රීය කරන්නේ කෙසේදැයි බලන්න.",
        fullName: "සම්පූර්ණ නම",
        workEmail: "වැඩ ඊමේල්",
        company: "සමාගම",
        message: "පණිවිඩය",
        sendMessage: "පණිවිඩය යවන්න",
        yourName: "ඔබේ නම",
        companyName: "සමාගමේ නම",
        workflowGoalsPlaceholder: "ඔබගේ සහාය ක්‍රියාදාම අරමුණු ගැන අපට කියන්න",
      },
    },
    voice: {
      heading: "පැමිණිලි හඬ පටිගත කරන්න හෝ උඩුගත කරන්න",
      subtitle:
        "AI ක්‍රියාවලියට යැවීමට පෙර බහුභාෂා හඬ පැමිණිල්ල උඩුගත කර waveform පෙරදසුන බලන්න.",
      recordingPanelTitle: "බ්‍රවුසරයෙන් පටිගත කිරීම",
      filePanelTitle: "හඬ ගොනුව උඩුගත කිරීම",
      liveSpeechText: "සජීවී කථන පෙළ",
      mediaEvidenceTitle: "පැමිණිලි මාධ්‍ය සාක්ෂි",
      mediaEvidenceSubtitle: "ඡායාරූප/වීඩියෝ සාක්ෂි උඩුගත කරන්න හෝ කැමරාවෙන් සෘජුව ඡායාරූපයක් ගන්න.",
      takePhoto: "ඡායාරූපය ගන්න",
      uploadFromDevice: "ඡායාරූපය හෝ වීඩියෝව උඩුගත කරන්න",
      uploadingMedia: "මාධ්‍ය උඩුගත වෙමින්...",
    },
  },
  ta: {
    languageName: "தமிழ்",
    languageLabel: "மொழி",
    nav: {
      dashboard: "பயனர் டாஷ்போர்டு",
      voiceUpload: "குரல் பதிவேற்றம்",
      analytics: "பகுப்பாய்வு",
      notifications: "அறிவிப்புகள்",
      agentDashboard: "ஏஜென்ட் டாஷ்போர்டு",
      adminDashboard: "அட்மின் டாஷ்போர்டு",
      settings: "அமைப்புகள்",
      features: "அம்சங்கள்",
      about: "எங்களை பற்றி",
      pricing: "விலைப்பட்டியல்",
      contact: "தொடர்பு",
    },
    actions: {
      login: "உள்நுழை",
      getStarted: "தொடங்குங்கள்",
    },
    footer: {
      company: "நிறுவனம்",
      support: "ஆதரவு",
      builtForSupport: "நவீன ஆதரவு செயல்பாடுகளுக்காக உருவாக்கப்பட்டது.",
      productDescription:
        "ஆதரவுச் செயல்பாடுகளுக்குப் பலமொழிக் குரல் முதல் வேலைநெறித் தானியங்குவரை செயற்கை நுண்ணறிவு இணைப்பு.",
    },
    pages: {
      features: {
        title: "அம்ச அடுக்கு",
        subtitle:
          "Voice2Action குரல் புகார் பெறுதல் முதல் டிக்கெட் தீர்வு பகுப்பாய்வு வரை முழுமையான AI வேலைநெறியை வழங்குகிறது.",
      },
      about: {
        title: "நவீன வாடிக்கையாளர் ஆதரவு அணிகளுக்காக உருவாக்கப்பட்டது",
        paragraphs: [
          "Voice2Action என்பது ஒழுங்கற்ற குரல் புகார்களை கட்டமைக்கப்பட்ட ஆதரவு வேலைநெறிகளாக மாற்ற வடிவமைக்கப்பட்ட பலமொழி AI தளமாகும்.",
          "எங்கள் நோக்கம் ஆதரவு அணிகள் பதில் நேரத்தை குறைக்க, அவசர பிரச்சினைகளை துல்லியமாக முன்னுரிமைப்படுத்த, மற்றும் தரவின் அடிப்படையில் தெளிவுடன் செயல்பட உதவுவது.",
          "இந்த தளம் குரல்-உரை மாற்றம், மொழி கண்டறிதல், உணர்வுப் பகுப்பாய்வு, அவசர மதிப்பீடு மற்றும் டிக்கெட் தானியங்குவை ஒரே தயாரிப்பு தயாரான அமைப்பாக இணைக்கிறது.",
        ],
      },
      pricing: {
        title: "ஒவ்வொரு வளர்ச்சி நிலையிற்குமான விலை திட்டங்கள்",
        subtitle:
          "பலமொழி குரல் நுண்ணறிவு, தானியக்க வேலைநெறிகள், மற்றும் மேம்பட்ட ஆதரவு பகுப்பாய்வுகளுடன் வேகமாக தொடங்கி வளருங்கள்.",
      },
      contact: {
        title: "எங்கள் அணியுடன் பேசுங்கள்",
        subtitle:
          "ஒரு தயாரிப்பு விளக்கத்தை பதிவு செய்து, Voice2Action உங்கள் ஆதரவு அமைப்பில் புகார் கையாளுதலை எவ்வாறு தானியக்கமாக்குகிறது என்பதை பாருங்கள்.",
        fullName: "முழுப் பெயர்",
        workEmail: "பணியிடம் மின்னஞ்சல்",
        company: "நிறுவனம்",
        message: "செய்தி",
        sendMessage: "செய்தி அனுப்பு",
        yourName: "உங்கள் பெயர்",
        companyName: "நிறுவனப் பெயர்",
        workflowGoalsPlaceholder: "உங்கள் ஆதரவு வேலைநெறி இலக்குகள் பற்றி சொல்லுங்கள்",
      },
    },
    voice: {
      heading: "புகார் ஒலியை பதிவு செய்யவும் அல்லது பதிவேற்றவும்",
      subtitle:
        "AI செயல்முறைக்கு அனுப்பும் முன் பலமொழி புகார் ஒலியை சமர்ப்பித்து waveform முன்தோற்றத்தைப் பாருங்கள்.",
      recordingPanelTitle: "உலாவியில் பதிவு செய்க",
      filePanelTitle: "ஒலி கோப்பை பதிவேற்று",
      liveSpeechText: "நேரடி உரை",
      mediaEvidenceTitle: "புகார் ஆதார ஊடகம்",
      mediaEvidenceSubtitle: "படம்/வீடியோ ஆதாரத்தை பதிவேற்றவும் அல்லது கேமராவில் நேரடியாக படம் எடுக்கவும்.",
      takePhoto: "புகைப்படம் எடு",
      uploadFromDevice: "படம் அல்லது வீடியோ பதிவேற்று",
      uploadingMedia: "ஊடகம் பதிவேற்றப்படுகிறது...",
    },
  },
};

export function getDictionary(language: AppLanguage | null | undefined): Dictionary {
  if (!language) {
    return dictionaries[defaultLanguage];
  }
  return dictionaries[language] ?? dictionaries[defaultLanguage];
}
