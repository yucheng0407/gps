package net.ruixin.enumerate.plat;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class DecisionTypeSerializer extends JsonSerializer<DecisionType> {
    @Override
    public void serialize(DecisionType value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(String.valueOf(value.id));
    }
}
