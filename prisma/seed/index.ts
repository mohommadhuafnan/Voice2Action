import "dotenv/config";
import {
  ActivityAction,
  AnalysisStatus,
  MessageType,
  NotificationType,
  PrismaClient,
  SystemRole,
  TicketCategory,
  TicketChannel,
  TicketPriority,
  TicketStatus,
  UploadSource,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.userRole.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.aiAnalysis.deleteMany(),
    prisma.audioUpload.deleteMany(),
    prisma.ticketMessage.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const [adminRole, supportRole, userRole] = await Promise.all([
    prisma.role.create({
      data: {
        name: SystemRole.ADMIN,
        description: "System administrator with full platform access",
      },
    }),
    prisma.role.create({
      data: {
        name: SystemRole.SUPPORT_AGENT,
        description: "Support team member handling assigned tickets",
      },
    }),
    prisma.role.create({
      data: {
        name: SystemRole.USER,
        description: "End customer who submits complaints",
      },
    }),
  ]);

  const admin = await prisma.user.create({
    data: {
      clerkId: "clerk_admin_001",
      email: "admin@voice2action.ai",
      firstName: "Maya",
      lastName: "Perera",
      preferredLang: "en",
      timezone: "Asia/Colombo",
    },
  });

  const agentOne = await prisma.user.create({
    data: {
      clerkId: "clerk_agent_001",
      email: "agent.kavindu@voice2action.ai",
      firstName: "Kavindu",
      lastName: "Fernando",
      preferredLang: "si",
      timezone: "Asia/Colombo",
    },
  });

  const agentTwo = await prisma.user.create({
    data: {
      clerkId: "clerk_agent_002",
      email: "agent.anjali@voice2action.ai",
      firstName: "Anjali",
      lastName: "Rajendran",
      preferredLang: "ta",
      timezone: "Asia/Colombo",
    },
  });

  const customerOne = await prisma.user.create({
    data: {
      clerkId: "clerk_user_001",
      email: "nimal.customer@example.com",
      firstName: "Nimal",
      lastName: "Silva",
      preferredLang: "en",
      timezone: "Asia/Colombo",
    },
  });

  const customerTwo = await prisma.user.create({
    data: {
      clerkId: "clerk_user_002",
      email: "tharushi.customer@example.com",
      firstName: "Tharushi",
      lastName: "Jayasinghe",
      preferredLang: "si",
      timezone: "Asia/Colombo",
    },
  });

  const customerThree = await prisma.user.create({
    data: {
      clerkId: "clerk_user_003",
      email: "arun.customer@example.com",
      firstName: "Arun",
      lastName: "Kumar",
      preferredLang: "ta",
      timezone: "Asia/Colombo",
    },
  });

  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: adminRole.id },
      { userId: agentOne.id, roleId: supportRole.id },
      { userId: agentTwo.id, roleId: supportRole.id },
      { userId: customerOne.id, roleId: userRole.id },
      { userId: customerTwo.id, roleId: userRole.id },
      { userId: customerThree.id, roleId: userRole.id },
    ],
  });

  const ticketOne = await prisma.ticket.create({
    data: {
      ticketNo: "V2A-2026-0001",
      title: "Package delayed for three days",
      description:
        "Customer reports that package has not arrived for three days and asks for urgent support.",
      category: TicketCategory.DELIVERY,
      channel: TicketChannel.VOICE,
      status: TicketStatus.ESCALATED,
      priority: TicketPriority.HIGH,
      urgencyScore: 0.91,
      language: "English",
      intent: "delivery_complaint",
      sentiment: "frustrated",
      recommendedAction: "escalate_to_support",
      reporterId: customerOne.id,
      assigneeId: agentOne.id,
    },
  });

  const ticketTwo = await prisma.ticket.create({
    data: {
      ticketNo: "V2A-2026-0002",
      title: "Mixed-language billing mismatch complaint",
      description:
        "Customer reports invoice mismatch and unauthorized service charge in Sinhala-English mixed speech.",
      category: TicketCategory.BILLING,
      channel: TicketChannel.VOICE,
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.MEDIUM,
      urgencyScore: 0.63,
      language: "Mixed",
      intent: "billing_dispute",
      sentiment: "concerned",
      recommendedAction: "assign_billing_team",
      reporterId: customerTwo.id,
      assigneeId: agentTwo.id,
    },
  });

  const ticketThree = await prisma.ticket.create({
    data: {
      ticketNo: "V2A-2026-0003",
      title: "Tamil technical app login issue",
      description: "Customer cannot log in to the mobile app after password reset.",
      category: TicketCategory.TECHNICAL,
      channel: TicketChannel.VOICE,
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      urgencyScore: 0.74,
      language: "Tamil",
      intent: "technical_login_issue",
      sentiment: "anxious",
      recommendedAction: "route_to_technical_support",
      reporterId: customerThree.id,
      assigneeId: agentTwo.id,
    },
  });

  const audioOne = await prisma.audioUpload.create({
    data: {
      userId: customerOne.id,
      ticketId: ticketOne.id,
      source: UploadSource.BROWSER_RECORDING,
      fileName: "complaint-delivery-delay-001.webm",
      mimeType: "audio/webm",
      sizeBytes: 1453290,
      durationSec: 33,
      storageProvider: "uploadthing",
      storageKey: "voice/2026/05/complaint-delivery-delay-001.webm",
      publicUrl: "https://cdn.voice2action.ai/voice/complaint-delivery-delay-001.webm",
      waveform: {
        peaks: [0.1, 0.24, 0.44, 0.65, 0.52, 0.35, 0.22, 0.12],
      },
    },
  });

  const audioTwo = await prisma.audioUpload.create({
    data: {
      userId: customerTwo.id,
      ticketId: ticketTwo.id,
      source: UploadSource.FILE_UPLOAD,
      fileName: "billing-mixed-voice-002.mp3",
      mimeType: "audio/mpeg",
      sizeBytes: 2021940,
      durationSec: 46,
      storageProvider: "uploadthing",
      storageKey: "voice/2026/05/billing-mixed-voice-002.mp3",
      publicUrl: "https://cdn.voice2action.ai/voice/billing-mixed-voice-002.mp3",
      waveform: {
        peaks: [0.14, 0.28, 0.31, 0.58, 0.74, 0.55, 0.39, 0.2],
      },
    },
  });

  const audioThree = await prisma.audioUpload.create({
    data: {
      userId: customerThree.id,
      ticketId: ticketThree.id,
      source: UploadSource.BROWSER_RECORDING,
      fileName: "tamil-login-issue-003.webm",
      mimeType: "audio/webm",
      sizeBytes: 1289842,
      durationSec: 29,
      storageProvider: "uploadthing",
      storageKey: "voice/2026/05/tamil-login-issue-003.webm",
      publicUrl: "https://cdn.voice2action.ai/voice/tamil-login-issue-003.webm",
      waveform: {
        peaks: [0.08, 0.19, 0.26, 0.33, 0.4, 0.29, 0.17, 0.11],
      },
    },
  });

  await prisma.aiAnalysis.createMany({
    data: [
      {
        ticketId: ticketOne.id,
        audioUploadId: audioOne.id,
        status: AnalysisStatus.COMPLETED,
        transcript: "My package still has not arrived, three days now, please check urgently.",
        language: "English",
        intent: "delivery_complaint",
        sentiment: "frustrated",
        urgencyScore: 0.91,
        priority: TicketPriority.HIGH,
        entities: {
          issue_type: "package delay",
          duration: "3 days",
        },
        confidence: 0.94,
        modelVersion: "valsea-multilang-v2",
        rawResponse: {
          language_detected: "en",
          tokens: 122,
        },
        recommendedAction: "escalate_to_support",
        processedAt: new Date(),
      },
      {
        ticketId: ticketTwo.id,
        audioUploadId: audioTwo.id,
        status: AnalysisStatus.COMPLETED,
        transcript:
          "Mage bill eka wadai. I did not request this extra charge. Please check quickly.",
        language: "Mixed",
        intent: "billing_dispute",
        sentiment: "concerned",
        urgencyScore: 0.63,
        priority: TicketPriority.MEDIUM,
        entities: {
          issue_type: "invoice mismatch",
          charge_type: "unauthorized service charge",
        },
        confidence: 0.89,
        modelVersion: "valsea-multilang-v2",
        rawResponse: {
          language_detected: "mixed",
          tokens: 139,
        },
        recommendedAction: "assign_billing_team",
        processedAt: new Date(),
      },
      {
        ticketId: ticketThree.id,
        audioUploadId: audioThree.id,
        status: AnalysisStatus.COMPLETED,
        transcript: "Naan password reset panninen, aana app login aagala.",
        language: "Tamil",
        intent: "technical_login_issue",
        sentiment: "anxious",
        urgencyScore: 0.74,
        priority: TicketPriority.HIGH,
        entities: {
          issue_type: "login failure",
          context: "after password reset",
        },
        confidence: 0.92,
        modelVersion: "valsea-multilang-v2",
        rawResponse: {
          language_detected: "ta",
          tokens: 97,
        },
        recommendedAction: "route_to_technical_support",
        processedAt: new Date(),
      },
    ],
  });

  await prisma.ticketMessage.createMany({
    data: [
      {
        ticketId: ticketOne.id,
        senderId: customerOne.id,
        type: MessageType.COMMENT,
        content: "I really need this package today. Please update me.",
      },
      {
        ticketId: ticketOne.id,
        senderId: agentOne.id,
        type: MessageType.STATUS_CHANGE,
        content: "Escalated to logistics hub for immediate investigation.",
      },
      {
        ticketId: ticketTwo.id,
        senderId: customerTwo.id,
        type: MessageType.COMMENT,
        content: "Please remove the additional charge from my invoice.",
      },
      {
        ticketId: ticketThree.id,
        senderId: customerThree.id,
        type: MessageType.COMMENT,
        content: "Unable to access account since yesterday.",
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: agentOne.id,
        ticketId: ticketOne.id,
        senderId: admin.id,
        type: NotificationType.TICKET_ESCALATED,
        title: "Urgent escalation assigned",
        message: "Ticket V2A-2026-0001 has been escalated with high urgency.",
      },
      {
        userId: customerOne.id,
        ticketId: ticketOne.id,
        senderId: agentOne.id,
        type: NotificationType.TICKET_UPDATED,
        title: "Your complaint is being processed",
        message: "Your package delay complaint has been escalated to the support team.",
      },
      {
        userId: agentTwo.id,
        ticketId: ticketTwo.id,
        senderId: admin.id,
        type: NotificationType.TICKET_ASSIGNED,
        title: "New billing ticket assigned",
        message: "Ticket V2A-2026-0002 was assigned to your queue.",
      },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      {
        actorId: customerOne.id,
        ticketId: ticketOne.id,
        action: ActivityAction.TICKET_CREATED,
        targetType: "Ticket",
        targetId: ticketOne.id,
        summary: "Customer submitted a new delivery delay complaint by voice.",
      },
      {
        actorId: agentOne.id,
        ticketId: ticketOne.id,
        action: ActivityAction.TICKET_ESCALATED,
        targetType: "Ticket",
        targetId: ticketOne.id,
        summary: "Agent escalated ticket due to high urgency score.",
      },
      {
        actorId: admin.id,
        ticketId: ticketTwo.id,
        action: ActivityAction.TICKET_ASSIGNED,
        targetType: "Ticket",
        targetId: ticketTwo.id,
        summary: "Admin assigned ticket to billing support agent.",
      },
      {
        actorId: customerThree.id,
        ticketId: ticketThree.id,
        action: ActivityAction.VOICE_UPLOADED,
        targetType: "AudioUpload",
        targetId: audioThree.id,
        summary: "Customer uploaded Tamil voice complaint recording.",
      },
    ],
  });

  await prisma.setting.createMany({
    data: [
      {
        userId: admin.id,
        key: "dashboard.defaultTimeRange",
        value: "30d",
        scope: "user",
        description: "Default analytics time range",
      },
      {
        userId: agentOne.id,
        key: "notifications.email.enabled",
        value: true,
        scope: "user",
      },
      {
        userId: null,
        key: "system.escalation.highUrgencyThreshold",
        value: 0.8,
        scope: "system",
        description: "Urgency threshold above which tickets auto-escalate",
      },
      {
        userId: null,
        key: "system.localization.defaultLanguage",
        value: "en",
        scope: "system",
      },
    ],
  });

  console.log("Seed completed with realistic Voice2Action data.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
