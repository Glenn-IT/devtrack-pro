ALTER TABLE weekly_entries
  ADD COLUMN activity_status VARCHAR(50) DEFAULT 'Not Yet' AFTER recom_implemented,
  ADD COLUMN activity_implemented VARCHAR(50) DEFAULT 'Not Yet' AFTER activity_status;
