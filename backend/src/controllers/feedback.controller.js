import Joi from "joi";
import { prisma } from "../config/prisma.js";

// ─────────────────────────────────────────────
// Validation schema for POST /api/feedback
// ─────────────────────────────────────────────
const feedbackSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
  feedbackType: Joi.string()
    .valid(
      "extra_document",
      "bribe_request",
      "delay",
      "good_experience",
      "other"
    )
    .default("other"),
  language: Joi.string().valid("am", "om", "en", "ti").default("am"),
  serviceId: Joi.string().uuid().optional().allow(null, ""),
  woredaId: Joi.string().optional().allow(null, ""),
  audioUrl: Joi.string().uri().optional().allow(null, ""),
});

// ─────────────────────────────────────────────
// POST /api/feedback
// ─────────────────────────────────────────────
export async function submitFeedback(req, res, next) {
  try {
    const { error, value } = feedbackSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Normalize empty strings → null
    const data = {
      content: value.content,
      feedbackType: value.feedbackType,
      language: value.language,
      serviceId: value.serviceId || null,
      woredaId: value.woredaId || null,
      audioUrl: value.audioUrl || null,
    };

    const feedback = await prisma.anonymousFeedback.create({ data });

    return res.status(201).json({
      success: true,
      data: {
        id: feedback.id,
        message: "Thank you — your feedback has been recorded anonymously.",
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────
// GET /api/feedback/dashboard
// ─────────────────────────────────────────────
export async function getDashboard(req, res, next) {
  try {
    const total = await prisma.anonymousFeedback.count();

    // Count by type
    const byType = await prisma.anonymousFeedback.groupBy({
      by: ["feedbackType"],
      _count: { _all: true },
    });

    // Count by service
    const byServiceRaw = await prisma.anonymousFeedback.groupBy({
      by: ["serviceId"],
      _count: { _all: true },
      where: { serviceId: { not: null } },
    });

    // Enrich services with names
    const serviceIds = byServiceRaw.map((s) => s.serviceId).filter(Boolean);
    const services = serviceIds.length
      ? await prisma.service.findMany({
          where: { id: { in: serviceIds } },
          select: { id: true, name: true, slug: true },
        })
      : [];

    const serviceMap = Object.fromEntries(
      services.map((s) => [s.id, s])
    );

    const byService = byServiceRaw.map((s) => ({
      id: s.serviceId,
      name: serviceMap[s.serviceId]?.name || "Unknown service",
      count: s._count._all,
    }));

    // Feedback type display mapping
    const typeLabels = {
      extra_document: "Extra document requested",
      bribe_request: "Extra fee / bribe requested",
      delay: "Delayed beyond official time",
      good_experience: "Good experience",
      other: "Other",
    };

    const typeColors = {
      extra_document: "primary",
      bribe_request: "red",
      delay: "yellow",
      good_experience: "green",
      other: "primary",
    };

    const byFeedbackType = byType.map((t) => ({
      id: t.feedbackType,
      label: typeLabels[t.feedbackType] || t.feedbackType,
      percent: total > 0 ? Math.round((t._count._all / total) * 100) : 0,
      count: t._count._all,
      color: typeColors[t.feedbackType] || "primary",
    }));

    // Woreda breakdown (if we have woredaId stored)
    const byWoredaRaw = await prisma.anonymousFeedback.groupBy({
      by: ["woredaId"],
      _count: { _all: true },
      where: { woredaId: { not: null } },
    });

    const byWoreda = byWoredaRaw.map((w) => ({
      id: w.woredaId,
      name: w.woredaId,
      count: w._count._all,
    }));

    return res.json({
      success: true,
      data: {
        summary: {
          totalReports: total,
          avgTimeDays: 0, // TODO: compute when time data is captured
          extraFeePercent: byFeedbackType.find((t) => t.id === "bribe_request")?.percent || 0,
          extraDocPercent: byFeedbackType.find((t) => t.id === "extra_document")?.percent || 0,
        },
        byService,
        byWoreda,
        byFeedbackType,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}
// ─────────────────────────────────────────────
// GET /api/feedback/list?page=1&limit=20
// ─────────────────────────────────────────────
export async function listFeedback(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.anonymousFeedback.count(),
      prisma.anonymousFeedback.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // Enrich service IDs with names
    const serviceIds = [...new Set(items.map((i) => i.serviceId).filter(Boolean))];
    const services = serviceIds.length
      ? await prisma.service.findMany({
          where: { id: { in: serviceIds } },
          select: { id: true, name: true, slug: true },
        })
      : [];

    const serviceMap = Object.fromEntries(services.map((s) => [s.id, s]));

    const formatted = items.map((item) => ({
      id: item.id,
      content: item.content,
      feedbackType: item.feedbackType,
      language: item.language,
      serviceId: item.serviceId,
      serviceName: serviceMap[item.serviceId]?.name || null,
      woredaId: item.woredaId,
      createdAt: item.createdAt,
      audioUrl: item.audioUrl,
    }));

    return res.json({
      success: true,
      data: {
        items: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + items.length < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}