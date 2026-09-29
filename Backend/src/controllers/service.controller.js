export function createServiceController(repository) {
  return {
    list: async (req, res) => {
      const services = await repository.findServices(req.query.q);
      const languageSuffix = getLanguageSuffix(req.query.language);

      const data = services.map((service) => ({
        slug: service.slug,
        name: service[`name${languageSuffix}`],
        description: service[`description${languageSuffix}`],
      }));

      res.json({ success: true, data });
    },

    getBySlug: async (req, res) => {
      const service = await repository.findService(req.params.slug);

      if (!service) {
        const error = new Error("Service not found");
        error.statusCode = 404;
        throw error;
      }

      res.json({ success: true, data: service });
    },
  };
}

function getLanguageSuffix(language) {
  const suffixes = {
    en: "En",
    am: "Am",
    om: "Om",
    ti: "Ti",
  };

  return suffixes[language] || suffixes.en;
}
