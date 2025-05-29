ALTER TABLE hedgehog
    DROP COLUMN location;

ALTER TABLE hedgehog
    ADD COLUMN location geometry(POINT);
