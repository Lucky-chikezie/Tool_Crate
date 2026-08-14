const Tool = require('../models/Tool');

// @route POST /api/tools
// @desc  Submit a new AI tool (authenticated)
async function submitTool(req, res) {
  try {
    const { name, description, category, link } = req.body;

    if (!name || !description || !category || !link) {
      return res.status(400).json({ message: 'name, description, category and link are all required' });
    }

    const tool = await Tool.create({
      name,
      description,
      category,
      link,
      submittedBy: req.user._id,
    });

    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit tool', error: err.message });
  }
}

// @route POST /api/tools/:id/upvote
// @desc  Upvote a tool (authenticated, one upvote per user per tool)
async function upvoteTool(req, res) {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    const alreadyUpvoted = tool.upvoters.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyUpvoted) {
      return res.status(409).json({ message: 'You have already upvoted this tool' });
    }

    tool.upvoters.push(req.user._id);
    tool.upvoteCount = tool.upvoters.length;
    await tool.save();

    res.status(200).json({ message: 'Upvote recorded', upvoteCount: tool.upvoteCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upvote tool', error: err.message });
  }
}

// @route GET /api/tools/recent
async function getRecentTools(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const tools = await Tool.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent tools', error: err.message });
  }
}

// @route GET /api/tools/popular
async function getPopularTools(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const tools = await Tool.find().sort({ upvoteCount: -1, createdAt: -1 }).limit(limit);
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular tools', error: err.message });
  }
}

// @route GET /api/tools/:id/related
// Strategy: same category first (excluding itself), ranked by upvoteCount.
// If that doesn't fill the limit, backfill with a text search across the
// tool's own name/description.
async function getRelatedTools(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    const sameCategory = await Tool.find({
      _id: { $ne: tool._id },
      category: tool.category,
    })
      .sort({ upvoteCount: -1, createdAt: -1 })
      .limit(limit);

    let related = sameCategory;

    if (related.length < limit) {
      const excludeIds = [tool._id, ...related.map((t) => t._id)];
      const textMatches = await Tool.find(
        {
          _id: { $nin: excludeIds },
          $text: { $search: `${tool.name} ${tool.description}` },
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit - related.length);

      related = related.concat(textMatches);
    }

    res.status(200).json(related);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch related tools', error: err.message });
  }
}

module.exports = {
  submitTool,
  upvoteTool,
  getRecentTools,
  getPopularTools,
  getRelatedTools,
};