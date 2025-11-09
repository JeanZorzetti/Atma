const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { adminLimiter } = require('../middleware/rateLimiter');

// Apply admin limiter (60 req/min instead of general 100 req/15min)
router.use(adminLimiter);

/**
 * GET /api/market-benchmarks
 * Get all market benchmarks, optionally filtered by category
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT
        id,
        category,
        metric_key,
        metric_name,
        metric_value,
        metric_unit,
        description,
        source,
        last_updated,
        created_at
      FROM market_benchmarks
    `;

    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY FIELD(category, "SEO", "CONVERSAO", "GERAL"), id';

    const benchmarks = await executeQuery(query, params);

    res.json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    console.error('Error fetching market benchmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market benchmarks',
      message: error.message
    });
  }
});

/**
 * GET /api/market-benchmarks/:id
 * Get a specific benchmark by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const benchmarks = await executeQuery(
      'SELECT * FROM market_benchmarks WHERE id = ?',
      [id]
    );

    if (benchmarks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Benchmark not found'
      });
    }

    res.json({
      success: true,
      data: benchmarks[0]
    });
  } catch (error) {
    console.error('Error fetching benchmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch benchmark',
      message: error.message
    });
  }
});

/**
 * PUT /api/market-benchmarks/:id
 * Update a specific benchmark
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      metric_name,
      metric_value,
      metric_unit,
      description,
      source
    } = req.body;

    // Validate required fields
    if (metric_value === undefined || metric_value === null) {
      return res.status(400).json({
        success: false,
        error: 'metric_value is required'
      });
    }

    // Check if benchmark exists
    const existing = await executeQuery(
      'SELECT id FROM market_benchmarks WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Benchmark not found'
      });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (metric_name !== undefined) {
      updates.push('metric_name = ?');
      params.push(metric_name);
    }

    if (metric_value !== undefined) {
      updates.push('metric_value = ?');
      params.push(metric_value);
    }

    if (metric_unit !== undefined) {
      updates.push('metric_unit = ?');
      params.push(metric_unit);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (source !== undefined) {
      updates.push('source = ?');
      params.push(source);
    }

    updates.push('last_updated = CURRENT_TIMESTAMP');
    params.push(id);

    await executeQuery(
      `UPDATE market_benchmarks SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Fetch updated benchmark
    const updated = await executeQuery(
      'SELECT * FROM market_benchmarks WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Benchmark updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating benchmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update benchmark',
      message: error.message
    });
  }
});

/**
 * POST /api/market-benchmarks/bulk-update
 * Update multiple benchmarks at once
 */
router.post('/bulk-update', async (req, res) => {
  try {
    const { benchmarks } = req.body;

    if (!Array.isArray(benchmarks) || benchmarks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'benchmarks array is required'
      });
    }

    const results = [];

    for (const benchmark of benchmarks) {
      const { id, metric_value, source } = benchmark;

      if (!id || metric_value === undefined) {
        continue;
      }

      await executeQuery(
        `UPDATE market_benchmarks
         SET metric_value = ?, source = ?, last_updated = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [metric_value, source || null, id]
      );

      results.push({ id, updated: true });
    }

    res.json({
      success: true,
      message: `${results.length} benchmarks updated successfully`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk updating benchmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update benchmarks',
      message: error.message
    });
  }
});

/**
 * GET /api/market-benchmarks/categories/list
 * Get list of available categories
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await executeQuery(
      'SELECT DISTINCT category FROM market_benchmarks ORDER BY FIELD(category, "SEO", "CONVERSAO", "GERAL")'
    );

    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

module.exports = router;
