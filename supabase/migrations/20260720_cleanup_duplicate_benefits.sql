-- PREVIEW: Show which records will be kept and which will be deleted
-- Do NOT run DELETE - this is read-only preview

-- Records to KEEP (one per display_order, preferring latest updated_at)
-- These are the records that will remain after cleanup
SELECT id, title, display_order, created_at, updated_at
FROM benefits b1
WHERE (
  display_order IN (0, 1, 2, 3)
  AND updated_at = (
    SELECT MAX(updated_at)
    FROM benefits b2
    WHERE b2.display_order = b1.display_order
  )
)
ORDER BY display_order ASC;

-- Records to DELETE (all others)
-- These records are duplicates or legacy data
-- Uncomment and run only after confirming the above results:

-- SELECT id, title, display_order, created_at, updated_at
-- FROM benefits
-- WHERE id NOT IN (
--   SELECT id
--   FROM benefits b1
--   WHERE (
--     display_order IN (0, 1, 2, 3)
--     AND updated_at = (
--       SELECT MAX(updated_at)
--       FROM benefits b2
--       WHERE b2.display_order = b1.display_order
--     )
--   )
-- )
-- ORDER BY display_order ASC;