ALTER TABLE weekly_entries
  ADD COLUMN recom_implemented VARCHAR(50) DEFAULT 'Not Yet' AFTER recom_status;
